import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import * as schema from './schema'
import 'codemirror/theme/neat.css';
import 'codemirror/mode/yaml/yaml';

import './more.css'
import * as jsyaml from 'js-yaml'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'

// @ts-ignore
import sampleYaml from './sample.yaml';

declare global {
    interface Window {
        jsyaml: any;
    }
}
window.jsyaml = jsyaml;


export default class Validator {

    public editor: CodeMirror.Editor;

    private config: CodeMirror.EditorConfiguration = {
        viewportMargin: Infinity,
        tabSize: 3,
        lineNumbers: true,
        gutters: ["CodeMirror-lint-markers"],
        mode: 'yaml',
        theme: 'neat',
        lint: true
    };
    public errorMessage = message => `<div style="width:100%" class="alert alert-danger">
            <div>${message}</div>
            </div>
            </div>`
    public validateYAML = async () => {

        const resultsDiv = document.getElementById("results");
        try {
            const yamlMetadata = jsyaml.safeLoad(this.editor.getValue())

            const res = schema.validate(yamlMetadata, { abortEarly: false })

            const error = res.error;
            let resultHTML: string;
            resultsDiv.innerHTML = '';
            if (error)
                resultHTML = error.details.map(({ message }) =>
                    this.errorMessage(message)).join('')
            else resultHTML = `<div style="width:100%" class="alert alert-success" role="alert">
            Valid!
            </div>`;

            resultsDiv.innerHTML = resultHTML
        }
        catch (e) {

            resultsDiv.innerHTML = this.errorMessage(e.message)
        }

    }

    constructor(private readonly tagElement: HTMLTextAreaElement) {
        this.tagElement.innerHTML = sampleYaml;
        this.editor = CodeMirror.fromTextArea(this.tagElement, this.config);


    }
}