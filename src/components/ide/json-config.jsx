import React, { useRef, useState } from 'react';

function readFile(ref) {
    const file = ref.current.files[0];
    if (!file) {
        return;
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    })
}

export const JSONConfig =({t, config, updateConfig}) => {
    const ref = useRef(null)
    const [error, setError] = useState()
    const [message, setMessage] = useState()

    const importJSON = () => {
        const p = readFile(ref)
        setMessage()
        setError()
        p.then(text => {
            try {               
                const json = JSON.parse(text)
                updateConfig([], json)
                setMessage(t(["json", "success"]))
            } catch(e) {
                console.log(e)
                setError(t(["json", "invalidJSON"]))
            }
        });
        p.catch(() => setError(t(["json", "cannotReadFile"])));
    }

    const json = JSON.stringify(config, undefined, 2);
    const blob = new Blob([json], {type: "application/json"});
    const url  = URL.createObjectURL(blob);

    return <div className="cm-json">
        <h3 className="cm-space-lg">{t(["json", "importExport"])}</h3>
        {
            error &&
            <p className="cm-message cm-error">
                {error}
            </p>
        }
        {
            message &&
            <p className="cm-message cm-success">
                {message}
            </p>
        }
        <form className="cm-config-controls">
            <fieldset>
                <label htmlFor="cm-file-import" className="cm-upload-label">
                    <a className="cm-control-button cm-success">&#8613; {t(["json", "import"])}</a>
                </label>
                <input onChange={importJSON} ref={ref} className="cm-file-import" id="cm-file-import" type="file"/>
                <a download="klaro-config.json" href={url} className="cm-control-button cm-primary">&#8615; {t(["json", "export"])}</a>
            </fieldset>
        </form>
        <p>
            {t(["json", "rawText"])}
        </p>
        <pre>
            <code>
                {JSON.stringify(config, undefined, 2)}
            </code>
        </pre>
    </div>
}