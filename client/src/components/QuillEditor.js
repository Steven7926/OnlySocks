import React from 'react';
import ReactQuill from 'react-quill';
import ImageResize from 'quill-image-resize-module-react'
import 'react-quill/dist/quill.snow.css'; 
import ImageCompress from 'quill-image-compress';
const Quill = ReactQuill.Quill;
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageCompress', ImageCompress);

export var statustext = '';

class QuillEditor extends React.Component {

    constructor(props) {
        super(props)
        this.state = { editorHtml: '', theme: 'snow' }
        this.handleChange = this.handleChange.bind(this)
        this.rteChange = this.rteChange.bind(this);
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    rteChange = (content, delta, source, editor) => {
        var textcontent = editor.getHTML();
        statustext = textcontent;
    }

    render() {
        return (
            <ReactQuill
                id="quilleditor"
                value={this.state.text}
                onChange={this.handleChange}
                className="status"
                modules={QuillEditor.modules}
                formats={QuillEditor.formats}
                onChange={this.rteChange}
            />
        )
    }
}

QuillEditor.modules = {
    imageResize: {
        modules: ['Resize', 'DisplaySize'],
        handleStyles: {
            border: 'solid',
        }
    },
    imageCompress: {
        quality: 0.7, // default
        maxWidth: 250, // default
        maxHeight: 350, // default
        imageType: 'image/jpeg', 
        imageType: 'image/jpg', 
        imageType: 'image/png',
        debug: true, // default
    },
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image']
    ],
}

QuillEditor.formats = [
    'header',
    'bold', 'italic', 'underline',
    'color',
    'list', 'bullet',
    'link', 'image', 'video'
]

export default QuillEditor;