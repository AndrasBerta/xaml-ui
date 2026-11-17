# ListViewBase

> Source: [ListViewBase.ts](../../../projects/xaml-ui/src/lib/collections/ListViewBase.ts)

Abstract base class of [ListView](ListView.md) and [GridView](GridView.md), as in WinUI. Adds the selection mode. Extends [Selector](../primitives/Selector.md) → [FrameworkElement](../FrameworkElement.md).

## Own Properties

| Input | Type | Default | Description |
|---|---|---|---|
| `SelectionMode` | `ListViewSelectionMode` | `'Single'` | `'Single'`: clicking an item selects it. `'None'`: items cannot be selected. |
| `IsItemClickEnabled` | `boolean` | `false` | Whether clicking an item raises `ItemClick`. |

| Output | Type | Description |
|---|---|---|
| `ItemClick` | `EventEmitter<number>` | An item was clicked, raised only when `IsItemClickEnabled` is set; carries the item's index |

`ListViewSelectionMode` follows WinUI's enumeration of the same name; `'Multiple'` and `'Extended'` are not supported yet.

With `SelectionMode="None"`:

- clicking an item does not select it, and setting `SelectedIndex`, `SelectedValue` or `SelectedItem` leaves the selection empty;
- switching to `'None'` clears the current selection, raising the change events.

Items show hover and pressed feedback only when they react to a click: when they can be selected, or when `IsItemClickEnabled` is set. A list with `SelectionMode="None"` and item click off is display only, as in WinUI. Set `IsItemClickEnabled` to use the items as buttons.

## Inherited Properties

- From [Selector](../primitives/Selector.md): `ItemSource`, `SelectedIndex`, `SelectedValue`, `SelectedItem`, `DisplayMemberPath`, `SelectedValuePath`, `IsEnabled`, `HorizontalContentAlignment`, `VerticalContentAlignment`, `ItemTemplate`
- Outputs: `SelectedIndexChange`, `SelectedValueChange`, `SelectedItemChange`
- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `MaxHeight`, `Margin`, `Padding`, etc.

## Example

**Display-only card grid:**

```html
<GridView [ItemSource]="components()" SelectionMode="None" HorizontalContentAlignment="Stretch">
  <ng-template let-item>
    <TextBlock [Text]="item.Name" />
  </ng-template>
</GridView>
```

**Items as buttons:**

```html
<ListView [ItemSource]="actions()" SelectionMode="None" [IsItemClickEnabled]="true" (ItemClick)="OnActionClick($event)" />
```
