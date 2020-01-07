import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import sanitizeHtml from 'sanitize-html'
import MarkupLink from '~/bundles/common/components/MarkupLink'

interface Props {
  editable?: boolean
  name?: string
  attribute?: string
  children?: any
  renderers?: any
}

interface State {
  inputValue: string
}

export default class MarkdownPreview extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    const sanitizedValue = this.sanitizeHtml(props.children)
    this.state = {
      inputValue: sanitizedValue,
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
        <div className="react-markdown-preview">
          <ReactMarkdown
            {...otherProps}
            renderers={{ ...otherProps.renderers, link: MarkupLink }}
          >
            {inputValue}
          </ReactMarkdown>
        </div>
      </>
    )
  }

  private handleInputChange = (event) => {
    const sanitizedValue = this.sanitizeHtml(event.target.value)
    this.setState({ inputValue: sanitizedValue })
  }

  private sanitizeHtml = (rawHtml) => {
    return sanitizeHtml(rawHtml, {
      allowedTags: [
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'ul',
        'ol',
        'li',
        'strong',
        'br',
        'div',
        'span',
        'p',
      ],
      allowedAttributes: { '*': ['id', 'class'] },
    })
  }
}
