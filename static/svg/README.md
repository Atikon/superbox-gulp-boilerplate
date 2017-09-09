# SVG sprite

All SVG files are automatically merged into the file sprite.svg.

## Usage Example

The filename is equal to the ID in SVG Sprite.

```html
<svg height="70" width="350">
    <use xlink:href="/static/svg/sprite.svg#superbox"></use>
</svg>
```
