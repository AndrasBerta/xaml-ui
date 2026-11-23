# WrapPanel

> Source: [WrapPanel.ts](../../../projects/xaml-ui/src/lib/layout/WrapPanel.ts)

Arranges children in a row (or column) and wraps them onto the next one when they run out of space. Modeled on the Windows Community Toolkit's `WrapPanel`, as WinUI has none. Uses CSS flexbox with wrapping. Extends [Panel](Panel.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Orientation` | `'Horizontal' \| 'Vertical'` | `'Horizontal'` | `'Horizontal'` fills rows left to right and wraps downwards. `'Vertical'` fills columns top to bottom and wraps to the right. |
| `HorizontalSpacing` | `string` | — | Gap between items horizontally (CSS `column-gap`) |
| `VerticalSpacing` | `string` | — | Gap between items vertically (CSS `row-gap`) |

## Inherited Properties

- From [Panel](Panel.md): `Background`, `CornerRadius`, `BorderThickness`, `BorderBrush`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Implementation

- `display: flex; flex-wrap: wrap`, with `flex-direction` set from `Orientation`
- Children keep their own size along the flow; across it they stretch to the size of their line, like an item stretched to its row in the toolkit's panel
- Lines are packed at the start (`align-content: flex-start`)
- A `'Vertical'` panel only wraps when its height is limited, e.g. with `Height` or `MaxHeight`

## Limitations

The panel uses flexbox, where only the alignment across the flow is configurable per child (`align-self`). In a `'Horizontal'` panel that is the child's `VerticalAlignment`, as expected. In a `'Vertical'` panel it is horizontal, but xaml-ui controls still map their `VerticalAlignment` to it, so only the default `Stretch` behaves as in WinUI there.

## Examples

**Tags that wrap onto new lines:**

```html
<WrapPanel HorizontalSpacing="4px" VerticalSpacing="4px">
  <Border *ngFor="let tag of tags()" Padding="2px 8px" CornerRadius="10px" Background="var(--AccentFillColorDefault)">
    <TextBlock [Text]="tag" />
  </Border>
</WrapPanel>
```

**Vertical flow:**

```html
<WrapPanel Orientation="Vertical" MaxHeight="200px" HorizontalSpacing="12px" VerticalSpacing="6px">
  <TextBlock *ngFor="let name of names()" [Text]="name" />
</WrapPanel>
```
