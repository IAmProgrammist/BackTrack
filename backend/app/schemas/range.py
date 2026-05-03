import re
from typing import Optional

from fastapi import Header, HTTPException
from pydantic import BaseModel, Field, field_validator


class RangeHeader(BaseModel):
    """Parser for HTTP Range header"""

    unit: str = Field(default="bytes")
    start: int | None = None
    end: int | None = None
    suffix_length: int | None = None  # For suffix ranges like "bytes=-500"

    @field_validator("start", "end", "suffix_length", mode="before")
    @classmethod
    def validate_ints(cls, v):
        return v

    @classmethod
    def parse(cls, range_header: str | None) -> Optional["RangeHeader"]:
        """Parse Range header string"""
        if not range_header:
            return None

        # Match pattern: bytes=0-100 or bytes=-500 or bytes=100-
        pattern = r"^([a-zA-Z]+)=(\d*)-(\d*)$"
        match = re.match(pattern, range_header.strip())

        if not match:
            return None

        unit, start_str, end_str = match.groups()

        # Handle suffix range (bytes=-500)
        if not start_str and end_str:
            suffix_length = int(end_str)
            return cls(unit=unit, suffix_length=suffix_length)

        # Handle normal range (bytes=0-100 or bytes=100-)
        start = int(start_str) if start_str else None
        end = int(end_str) if end_str else None

        if start is not None and end is not None and start > end:
            raise ValueError("Start cannot be greater than end")

        return cls(unit=unit, start=start, end=end)

    def to_tuple(self, total_size: int) -> tuple[int, int]:
        """Convert to (start, end) tuple based on total size"""
        if self.suffix_length is not None:
            # Handle suffix range: last N bytes
            start = max(0, total_size - self.suffix_length)
            end = total_size - 1
            return start, end

        start = self.start or 0
        end = self.end if self.end is not None else total_size - 1

        # Clamp to valid range
        start = max(0, min(start, total_size - 1))
        end = max(0, min(end, total_size - 1))

        if start > end:
            start = end

        return start, end

    def content_range(self, total_size: int) -> str:
        """Generate Content-Range header value"""
        start, end = self.to_tuple(total_size)
        return f"{self.unit} {start}-{end}/{total_size}"


# Dependency for FastAPI
async def parse_range_header(range: str | None = Header(None)) -> RangeHeader | None:
    """FastAPI dependency to parse Range header"""
    if not range:
        return None

    try:
        parsed = RangeHeader.parse(range)
        if not parsed:
            return None
        return parsed
    except ValueError as e:
        raise HTTPException(status_code=416, detail=str(e))
