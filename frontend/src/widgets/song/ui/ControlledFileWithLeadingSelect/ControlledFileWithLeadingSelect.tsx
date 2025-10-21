import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Button } from "shared/ui/Button";
import "./styles.css"
import { MdDelete } from "react-icons/md";
import type { ControlledFileWithLeadingSelectProps } from "./types";
import clsx from "clsx";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledCheckboxInput } from "shared/ui/ControlledCheckboxInput/ControlledCheckboxInput";

export const ControlledFileWithLeadingSelect = ({controlProps, containerProps = {}}: ControlledFileWithLeadingSelectProps) => {
    const methods = useFormContext();
    const name = controlProps.name;
    useWatch({control: methods.control, name})

    const handleFileAdded = () => {
        methods.setValue(name, [...methods.getValues(name) || [], {file: [], leading: false}])
    }

    const handleFileRemoved = (index: number) => {
        methods.setValue(name, (methods.getValues(name) as {file: [], leading: false}[]).filter((_, idx) => idx !== index))
    }

    return <div {...containerProps} className={clsx(containerProps?.className, "")}>
        Файлы
        <Controller 
            control={methods.control}
            name={name}
            render={({field: {value}, fieldState: {error}}) => {
                return <div className="file-with-leading-select">
                    {value?.map((_: unknown, index: number) => {
                        return <>
                            <hr/>
                            <div className="file-with-leading-item" key={index}>
                                <div className="file-with-leading-item-title">
                                    <ControlledFileInput inputProps={{placeholder: "Файл", className: "file-with-leading-item-file"}} controlProps={{name: `${name}.${index}.file`}}/>
                                    <Button type="button" equated onClick={() => handleFileRemoved(index)}><MdDelete/></Button>
                                </div>
                                <ControlledCheckboxInput inputProps={{subText: "Основной файл"}} controlProps={{name: `${name}.${index}.leading`}}/>
                            </div>
                        </>})}
                    {error?.root?.type === "check-if-only-of-type-leading" ? <div style={{color: "var(--error-color)"}}>{error?.root?.message}</div> : "Ведущий файл будет представлять собой песню в зависимости от своего типа. Например, ведущая картинка будет видна на обложке, а ведущий аудиофайл будет играть при вопсроизведении трека."}
                    <div><Button type="button" onClick={(_) => {
                        handleFileAdded()
                    }}>Добавить файл</Button></div>
                </div>}}/>
    </div>
}