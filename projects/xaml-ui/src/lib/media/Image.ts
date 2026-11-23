import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Stretch } from "../Common";
import { FrameworkElementComponent } from "../FrameworkElement";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'Image',
  template: `<img [src]="Source" [class]="Stretch" [ngStyle]="imageStyle" [alt]="" (load)="ImageOpened.emit($event)" (error)="ImageFailed.emit($event)">`,
  styleUrl: 'Image.scss',
  imports: [CommonModule]
})
export class ImageComponent extends FrameworkElementComponent {
  @Input() Source?: string;
  @Input() Stretch: Stretch = 'Uniform';

  //Raised when the image is loaded and decoded, or when it cannot be, as in WinUI
  @Output() ImageOpened = new EventEmitter<Event>();
  @Output() ImageFailed = new EventEmitter<Event>();

  protected get imageStyle() {
    return {
      width: this.Width,
      height: this.Height,
      maxWidth: this.MaxWidth,
      maxHeight: this.MaxHeight
    }
  }
}