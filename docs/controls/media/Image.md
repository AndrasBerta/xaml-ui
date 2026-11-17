# Image

> Source: [Image.ts](../../../projects/xaml-ui/src/lib/media/Image.ts)

Image display control with stretch modes. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `Source` | `string` | — | Image URL or data URI |
| `Stretch` | `'None' \| 'Fill' \| 'Uniform' \| 'UniformToFill'` | `'Uniform'` | How the image fills its bounds |

| Output | Type | Description |
|---|---|---|
| `ImageOpened` | `EventEmitter<Event>` | The image was loaded and decoded |
| `ImageFailed` | `EventEmitter<Event>` | The image could not be loaded or decoded |

## Stretch Modes

| Value | Description |
|---|---|
| `None` | Original size, no scaling |
| `Fill` | Stretches to fill, ignoring aspect ratio |
| `Uniform` | Scales to fit within bounds, preserving aspect ratio (may letterbox) |
| `UniformToFill` | Scales to fill bounds, preserving aspect ratio (may crop) |

## Inherited Properties

From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, `HorizontalAlignment`, `VerticalAlignment`, etc.

## Examples

```html
<Image [Source]="imageUrl" Stretch="Uniform" Width="400px" Height="400px" />
```

```html
<Image [Source]="thumbnailUrl" Stretch="UniformToFill" Width="100px" Height="100px" />
```

**Placeholder until the image is ready:**

```html
<Grid>
  <FontIcon *ngIf="!isLoaded" Glyph="&#xEA86;" />
  <Image [Source]="url" [Opacity]="isLoaded ? 1 : 0" (ImageOpened)="isLoaded = true" (ImageFailed)="isLoaded = false" />
</Grid>
```
