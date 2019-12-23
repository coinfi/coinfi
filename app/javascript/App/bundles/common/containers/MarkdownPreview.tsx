import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'

interface Props {
  editable?: boolean
  name?: string
  attribute?: string
  children?: any
}

interface State {
  inputValue: string
}

export default class MarkdownPreview extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: props.children,
    }
  }

  public render() {
    const { children, editable, name, attribute, ...otherProps } = this.props
    const { inputValue } = this.state
    const id = `${name}_${attribute}`
    const inputName = `${name}[${attribute}]`

    return (
      <>
        {editable && (
          <>
            <textarea
              style={{ minHeight: '500px' }}
              id={id}
              name={inputName}
              value={inputValue}
              onChange={this.handleInputChange}
            />
            <div style={{ marginTop: '1rem', fontWeight: 700 }}>
              Live markdown preview:{' '}
            </div>
          </>
        )}
        <div>
          <ReactMarkdown {...otherProps}>
            {editable ? inputValue : children}
          </ReactMarkdown>
        </div>
      </>
    )
  }

  private handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value })
  }
}
