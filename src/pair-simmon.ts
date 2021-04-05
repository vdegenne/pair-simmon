import { css, customElement, html, LitElement, query } from 'lit-element';
import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-textfield'
import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield';
import { nothing } from 'lit-html';

type Pair = {
  exchange: string,
  base: string,
  quote: string
}

@customElement('pair-simmon')
export class PairSimmon extends LitElement {
  private pairs: Pair[];

  @query('mwc-dialog') dialog!: Dialog;
  @query('mwc-textfield[label=exchange]') exchange!: TextField;
  @query('mwc-textfield[label=base]') base!: TextField;
  @query('mwc-textfield[label=quote]') quote!: TextField;

  constructor() {
    super()
    this.pairs = localStorage.getItem('pairs') ? JSON.parse(localStorage.getItem('pairs')!.toString()) : [];
    this.addEventListener('keyup', () => {
      this.requestUpdate()
    })
  }

  static styles = [
    css`
    :host {
      --mdc-theme-primary: #ffc107;
      display: block;
    }
    .orange {
      color: #ffc107;
    }
    header {
      margin: 10px 16px;
    }
    #content {
      margin: 24px 12px 12px;
      text-align: center;
    }
    #pairs {
      padding: 24px;
    }
    #pairs > mwc-button {
      --mdc-theme-primary: #ff6f00;
      margin: 4px;
    }
    mwc-textfield {
      width: 100%;
      margin-bottom: 16px;
    }
    `
  ]

  render() {
    return html`
    <header style="display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;">
        <img src="./images/logo.png" width="48px">
        <span style="font-size:24px;font-weight:500;margin-left:8px" class="orange">Pairsimmon</span>
      </div>
    </header>

    <div id="content">
      <div id="pairs">
        ${this.pairs.map(pair => {
          return html`<mwc-button unelevated title="${pair.exchange}"
            @mousedown="${(e: MouseEvent) => this.onPairClick(pair, e)}"
            @contextmenu="${(e: MouseEvent) => e.preventDefault()}">${pair.base} ${pair.quote}</mwc-button>`
        })}
      </div>
      <mwc-button outlined icon="add" class="orange" @click="${() => this.dialog.show()}">add pair</mwc-button>
      <div style="color:#bdbdbd;font-size:12px;text-align:left;width:150px;margin:24px auto">
      left click : visit cryptowatch<br>
      right click : delete pair<br>
      </div>
    </div>

    <mwc-dialog heading="Add pair">
      <div style="padding-top:12px;">
        <mwc-textfield label="exchange" outlined dialogInitialFocus
          helper="binance, kraken, ..." helperPersistent></mwc-textfield>
        <mwc-textfield label="base" outlined
          helper="eth, btc, ..." helperPersistent></mwc-textfield>
        <mwc-textfield label="quote" outlined
          helper="eur, usd, usdt, ..." helperPersistent></mwc-textfield>
      </div>
      <mwc-button outlined slot="secondaryAction" dialogAction="close">cancel</mwc-button>
      ${this.exchange && this.base && this.quote ? html`
        <mwc-button unelevated slot="primaryAction"
          ?disabled="${!(this.exchange.value && this.base.value && this.quote.value)}"
          @click="${() => this.submit()}">add</mwc-button>
      ` : nothing }
    </mwc-dialog>
    `
  }

  public onPairClick(pair: Pair, e: MouseEvent) {
    if (e.button === 0) {
      window.open(
        `https://cryptowat.ch/charts/${pair.exchange.toUpperCase()}:${pair.base.toUpperCase()}-${pair.quote.toUpperCase()}`,
        '_blank'
      )
    }
    else if (e.button === 2) {
      const confirm = window.confirm('are you sure to delete this pair ?')
      if (confirm) {
        this.pairs.splice(this.pairs.indexOf(pair), 1)
        this.requestUpdate()
        this.save()
      }
    }
  }

  firstUpdated() {
    this.requestUpdate()
  }

  submit () {
    const exchange = this.exchange.value;
    const base = this.base.value;
    const quote = this.quote.value;
    if (!(exchange && base && quote)) { return }

    this.pairs.push({
      exchange, base, quote
    })

    this.dialog.close()
    this.resetForm()
    this.requestUpdate()
    this.save()
  }

  resetForm() {
    this.exchange.value = '';
    this.base.value = '';
    this.quote.value = '';
  }

  save() {
    localStorage.setItem('pairs', JSON.stringify(this.pairs))
  }

}