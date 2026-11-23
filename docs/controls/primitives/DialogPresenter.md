# DialogPresenter

> Source: [DialogPresenter.ts](../../../projects/xaml-ui/src/lib/primitives/DialogPresenter.ts)

The frame a modal dialog's content sits in — surface, shadow, and optional header and footer bands. [ContentDialog](../dialogs-and-flyouts/ContentDialog.md) builds on it through `ContentDialogPresenter`; you use it directly only when building a dialog that does not want ContentDialog's button row.

Extends [XamlRoot](../XamlRoot.md), because the CDK overlay attaches its container at `<body>` level, outside any `XamlRoot` in the app template — the presenter re-establishes the theme tokens for the overlay subtree.

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `IsVisible` | `boolean` | `false` | Drives the open/close transition. Sets the `visible` host class |

## Content Slots

Content is projected into three bands by attribute:

| Slot | Selector | Description |
|---|---|---|
| Header | `[Header]` | Title band. Collapses entirely when nothing is projected |
| Body | *(default)* | Main content |
| Footer | `[Footer]` | Command band. Collapses entirely when nothing is projected |

## Behavior

- The header and footer are hidden rather than left as empty bands when their slot is unused, so a dialog with body content only has no stray gaps.
- As in WinUI, the dialog stays within the window, 24px from its edges, and the body scrolls in a [ScrollViewer](../scrolling/ScrollViewer.md) when the content does not fit; the header and footer stay in place.
- `DialogPresenter.TransitionDuration` (250 ms) is the time to wait before removing the content after setting `IsVisible` to `false`, so the closing transition can finish.
- Inherits `XamlRoot`'s behaviour, including blocking the browser context menu.

## Usage

```html
<DialogPresenter [IsVisible]="IsOpen">
  <TextBlock Header Text="Title" />
  <StackPanel>
    <!-- dialog body -->
  </StackPanel>
  <CommandBar Footer>
    <AppBarButton Text="Close" (Click)="Close()" />
  </CommandBar>
</DialogPresenter>
```

For ordinary dialogs prefer [ContentDialog](../dialogs-and-flyouts/ContentDialog.md), which supplies the title, button row and result handling.
