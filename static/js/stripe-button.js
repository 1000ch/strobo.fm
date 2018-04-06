export default class StripeButton extends HTMLElement {
  static get template() {
    return `
      <style>
        :host {
          display: inline-block;
          width: 160px;
        }
      </style>
      <div></div>
    `;
  }

  constructor() {
    super();

    this.attachShadow({
      mode: 'open'
    }).innerHTML = StripeButton.template;
  }

  async connectedCallback() {
    await this.insertStripeSDK();

    const stripe = Stripe('pk_live_CFjMMsFEB0CScQsH7xu4xNVp');
    const paymentRequest = stripe.paymentRequest({
      country: 'JP',
      currency: 'jpy',
      total: {
        label: 'Donate strobo.fm',
        amount: 100
      }
    });
    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
      style: {
        paymentRequestButton: {
          type: 'donate',
          theme: 'dark',
          height: '32px'
        }
      }
    });

    const result = await paymentRequest.canMakePayment();

    if (result) {
      prButton.mount(this.shadowRoot.querySelector('div'));
    }
  }

  async insertStripeSDK() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = resolve;
      script.onerror = reject;
      this.shadowRoot.appendChild(script);
    });
  }
}
