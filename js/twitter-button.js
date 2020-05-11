export default class TwitterButton extends HTMLElement {
  static get observedAttributes() {
    return [
      'type',
      'width',
      'height',
      'user',
      'text',
      'hashtag'
    ];
  }

  static get template() {
    return `
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <iframe allowtransparency="true" frameborder="0" scrolling="no"></iframe>
    `;
  }

  constructor() {
    super();

    this.attachShadow({
      mode: 'open'
    }).innerHTML = TwitterButton.template;
  }

  connectedCallback() {
    const iframe = this.shadowRoot.querySelector('iframe');
    iframe.width = `${this.width}px`;
    iframe.height = `${this.height}px`;
    iframe.src = this.getInlineFrameSource();
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    const iframe = this.shadowRoot.querySelector('iframe');
    switch (attributeName) {
      case 'width':
      case 'height':
        iframe[attributeName] = `${newValue}px`;
        break;
      default:
        iframe.src = this.getInlineFrameSource();
        break;
    }
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(newValue) {
    this.setAttribute('width', newValue);
  }

  get height() {
    return this.getAttribute('height');
  }

  set height(newValue) {
    this.setAttribute('height', newValue);
  }

  get type() {
    return this.getAttribute('type') || '';
  }

  set type(newValue) {
    this.setAttribute('type', newValue);
  }

  get hashtag() {
    const hashtag = this.getAttribute('hashtag') || '';
    return encodeURIComponent(hashtag);
  }

  set hashtag(newValue) {
    this.setAttribute('hashtag', newValue);
  }

  get href() {
    const href = this.getAttribute('href') || '';
    return encodeURIComponent(href);
  }

  set href(newValue) {
    this.setAttribute('href', newValue);
  }

  get text() {
    const text = this.getAttribute('text') || '';
    return encodeURIComponent(text);
  }

  set text(newValue) {
    this.setAttribute('text', newValue);
  }

  get user() {
    const user = this.getAttribute('user') || '';
    return encodeURIComponent(user);
  }

  set user(newValue) {
    this.setAttribute('user', newValue);
  }

  getInlineFrameSource() {
    switch (this.type) {
      case 'follow':
        return `//platform.twitter.com/widgets/follow_button.html?screen_name=${this.user}`;
        break;
      case 'share':
        return `//platform.twitter.com/widgets/tweet_button.html?url=${this.href}&via=${this.user}&text=${this.text}`;
        break;
      case 'hashtag':
        return `//platform.twitter.com/widgets/tweet_button.html?text=${this.text}&button_hashtag=${this.hashtag}&type=hashtag`;
        break;
      case 'mention':
        return `//platform.twitter.com/widgets/tweet_button.html?screen_name=${this.user}&type=mention`;
        break;
      default:
        return '';
    }
  }
}
