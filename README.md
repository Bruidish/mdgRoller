# MdgRoller: Use
A lightweight and easy way to display a viewport scrolling horizontally

## 1. Call dependencies
You require **mdgRoller/assets/css/mdgroller.css**
```html
<link rel="stylesheet" href="assets/css/mdgroller.css"/>
```
and **mdgRoller/assets/js/mdgroller.min.js**
```html
<script src="assets/js/mdgroller.min.js"></script>
```

## 2. Prepare template
Then create your slider:
```html
<div id="roller-1" class="roller-wrap">
    <div class="roller-collection-wrap">
        <ul class="roller-collection">
            <li class="roller-item" style="background-color:rebeccapurple"></li>
            <li class="roller-item" style="background-color:blue"></li>
            <li class="roller-item" style="background-color:red"></li>
            <li class="roller-item" style="background-color:green"></li>
            <li class="roller-item" style="background-color:yellow"></li>
            <li class="roller-item" style="background-color:rosybrown"></li>
            <li class="roller-item" style="background-color:darkcyan"></li>
        </ul>
    </div>

    <div class="roller-scrollbar-wrap">
        <div class="roller-scrollbar">
            <div class="roller-scrollbar-handler"></div>
        </div>
    </div>

    <div class="roller-action-wrap">
        <button class="roller-left"> < </button>
        <button class="roller-right"> > </button>
    </div>
</div>
```
Take care about **class[^=roller-]** it performs default styling

## 3. Instanciate your slider
Call the plugin in your js file
```javascript
new MdgRoller({
    // Required: Main container
    mainWrap: '#roller-1',
    // Required: Collection container
    collectionWrap: '.roller-collection',
    // Optional: Scrollbar container
    scrollBarWrap: '.roller-scrollbar-wrap',
    scrollBarHandler: '.roller-scrollbar-handler',
    // Optional: Buttons to navigate
    buttonLeft: '.roller-left',
    buttonRight: '.roller-right',
    // Optional: Scroll of Collection on Button click
    buttonScroll: 200,
    // Optional: Css values
    css: {
        // Optional: value in px added from either side to display collection beyound container
        paddingX: 100
    }
});
```

# MdgRoller: Development
You could use **ECMAScript 6** for javascript and **Compass** for css
```bash
# Go to _dev folder and install dependencies
cd _dev
npm install

# If occured error gyp: No Xcode or CLT version detected!
sudo xcode-select --reset

# And finaly
npm run watch
```
