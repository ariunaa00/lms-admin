class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>© 2026 My Website</p>
      </footer>
    `;
  }
}

customElements.define("app-footer", AppFooter);