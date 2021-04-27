/**
 * @author Michel Dumont <michel.dumont.io>
 * @version 1.0.0 - 2021-01-23
 * @license http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 * @package MdgRoller
 */

class MdgRoller {
  /** constructor
   *
   * @param object differents options
   *
   * @var {string} querySelector for mainWrap
   * @var {string} querySelector for collectionWrap
   * @var {string} querySelector for scrollBarWrap
   * @var {string} querySelector for scrollBarHandler
   * @var {string} querySelector for buttonLeft
   * @var {string} querySelector for buttonRight
   * @var {int|array} value for scroll action
   *
   * @return object this
   */
  constructor(params) {
    this.initOptions()
    this.setParams(params)

    if (!params.mainWrap || !params.collectionWrap) {
      return null
    }

    // Main component
    this.$mainWrap = document.querySelector(params.mainWrap);
    if (!this.$mainWrap) {
      return null
    }

    // Collection components
    this.$collectionWrap = this.$mainWrap.querySelector(params.collectionWrap);
    if (!this.$collectionWrap) {
      return null
    }
    this.renderCollection(true)

    // Scrollbar components
    if (params.scrollBarWrap && params.scrollBarHandler) {
      this.$scrollBarWrap = this.$mainWrap.querySelector(params.scrollBarWrap);
      this.$scrollBarHandler = this.$mainWrap.querySelector(params.scrollBarHandler);
      if (this.$scrollBarWrap && this.$scrollBarHandler) {
        this.scrollBarExists = true
        this.renderScrollBar()
        this.eventsScrollBar()
      }
    }

    // Action components
    if (params.buttonLeft && params.buttonRight) {
      this.$buttonLeft = this.$mainWrap.querySelector(params.buttonLeft);
      this.$buttonRight = this.$mainWrap.querySelector(params.buttonRight);
      if (this.$buttonLeft && this.$buttonRight) {
        this.buttonExists = true
        this.renderButtons()
        this.eventsButtons()
      }
    }

    // Events
    this.eventsCollection()
    this.events();

    return this
  }

  /** Set differents default options
   * @fixme babel dosen't support ES2019 Class fields
   * So I have to declare fields after constructor
   *
   * @todo add breakpoint mecanics
   *
   * @param object
   *
   * @return {void}
   */
  initOptions() {
    this.$mainWrap = null             /** @var noeud parent of all components */
    this.$collectionWrap = null       /** @var noeud parent of collection */
    this.scrollBarExists = false      /** @var boolean to specify if scrollbar exists */
    this.$scrollBarWrap = null        /** @var noeud of scrollbar */
    this.$scrollBarHandler = null     /** @var noeud of scrollbar */
    this.buttonExists = false         /** @var boolean to specify if scrollbar exists */
    this.$buttonLeft = null           /** @var noeud of left button to navigate */
    this.$buttonRight = null          /** @var noeud of right button to navigate */
    this.buttonScroll = 300           /** @var integer scroll of collection on button click */
    this.collectionCount = 0          /** @var interger number of items in collection */
    this.collectionViewportDelta = 0  /** @var interger part of collection visible */
    this.css = {
      paddingX: 0
    }
  }

  /** Set differents options regarding breakpoints
   * @todo add breakpoint mecanics
   *
   * @param object
   *
   * @return {void}
   */
  setParams(params) {
    params.mainWrap = params.mainWrap || null
    params.collectionWrap = params.collectionWrap || null
    params.scrollBarWrap = params.scrollBarWrap || null
    params.scrollBarHandler = params.scrollBarHandler || null
    params.buttonLeft = params.buttonLeft || null
    params.buttonScroll = params.buttonScroll || null

    if (typeof params.css != 'undefined') {
      this.css.paddingX = params.css.paddingX || this.css.paddingX
    }
  }

  /** Render for the collection
   *
   * @return {void}
   */
  renderCollection(first = false) {
    if (first && this.css.paddingX) {
      let emptyElement = document.createElement('li')
      emptyElement.style.width = `${this.css.paddingX}px`

      this.$collectionWrap.appendChild(emptyElement)
      this.$collectionWrap.style.paddingLeft = `${this.css.paddingX}px`
    }

    // Construct grid regarding width of each child
    let gridTemplateColumns = '';
    [...this.$collectionWrap.querySelectorAll('li')].forEach(el => {
      gridTemplateColumns += ` ${el.offsetWidth}px`
    });

    this.collectionCount = this.$collectionWrap.childElementCount
    this.$collectionWrap.style.gridTemplateColumns = gridTemplateColumns

    // Center smallest colletion
    this.$collectionWrap.style.width = 'unset'
    if (this.$collectionWrap.offsetWidth >= this.$collectionWrap.scrollWidth) {
      this.$collectionWrap.style.width = 'max-content'
    }
  }

  /** Render for the scrollBar
   *
   * @return {void}
   */
  renderScrollBar() {
    // Part of collection visible in viewport
    this.collectionViewportDelta = this.$collectionWrap.clientWidth / this.$collectionWrap.scrollWidth * 100;

    // Scrollbar style
    this.$scrollBarWrap.style.paddingLeft = `${this.css.paddingX}px`;
    this.$scrollBarWrap.style.paddingRight = `${this.css.paddingX}px`;

    // Scrollbar Handler style
    let scrollHandlerSize = (this.$scrollBarWrap.clientWidth * this.collectionViewportDelta / 100) - (this.css.paddingX * 2);
    this.$scrollBarHandler.style.width = `${scrollHandlerSize}px`;

    // Occulte scrollbar if useless
    this.$scrollBarWrap.classList.toggle('isInactive', (this.collectionViewportDelta == 100 || scrollHandlerSize <= 20));
  }

  /** Position Scrollbar handler concidering collection scroll
   * @todo take care about handler size when its size is forced
   *
   * @return {void}
   */
  moveScrollBarHandler() {
    this.$scrollBarHandler.style.marginLeft = `${this.$collectionWrap.parentNode.scrollLeft * this.collectionViewportDelta / 100}px`
  }

  /** Events of the scrollbar
   *
   * @return {void}
   */
  eventsScrollBar() {
    // On drag and drop handler
    this.$scrollBarHandler.addEventListener('mousedown', (event) => {
      let that = this;
      let pos = event.clientX - parseInt(this.$scrollBarHandler.style.marginLeft); // Position in the handler

      this.$collectionWrap.parentNode.style.scrollBehavior = 'inherit';
      this.$scrollBarHandler.classList.add('focus')

      function handlerMouseMove(event) {
        if (event.clientX > 0) {
          that.$collectionWrap.parentNode.scrollLeft = Math.ceil((event.clientX - pos) / that.collectionViewportDelta * 100);
        }
      }

      window.addEventListener('mousemove', handlerMouseMove)
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', handlerMouseMove)
        this.$collectionWrap.parentNode.style.scrollBehavior = 'smooth';
        this.$scrollBarHandler.classList.remove('focus')
      })
    })
  }

  /** Render for buttons
   *
   * @return {void}
   */
  renderButtons() {
    this.$buttonLeft.style.left = `${this.css.paddingX}px`
    this.$buttonRight.style.right = `${this.css.paddingX}px`

    this.$buttonLeft.classList.toggle('o-none', this.$collectionWrap.parentNode.scrollLeft <= 30)
    this.$buttonRight.classList.toggle('o-none', this.$collectionWrap.parentNode.scrollLeft >= this.$collectionWrap.scrollWidth - this.$collectionWrap.clientWidth - 30)
  }

  /** Events for buttons
   *
   * @return {void}
   */
  eventsButtons() {
    this.$buttonLeft.addEventListener('mouseup', () => this.$collectionWrap.parentNode.scrollLeft -= this.buttonScroll)
    this.$buttonRight.addEventListener('mouseup', () => this.$collectionWrap.parentNode.scrollLeft += this.buttonScroll)
  }

  /** Events of the collection
   *
   * @return {void}
   */
  eventsCollection() {
    // On scroll on collection
    this.$collectionWrap.parentNode.addEventListener('scroll', () => {
      this.scrollBarExists ? this.moveScrollBarHandler() : null
      this.buttonExists ? this.renderButtons() : null
    });
  }

  /** Events for global
   *
   * @return {void}
   */
  events() {
    // Resize window
    window.addEventListener('resize', () => {
      this.renderCollection();
      this.scrollBarExists ? this.renderScrollBar() : null
      this.scrollBarExists ? this.moveScrollBarHandler() : null
    })
  }

}