/**
 * Created by dattaram on 9/12/19.
 */

import {
  Component,
  Input,
  OnInit,
  ContentChild,
  TemplateRef
} from "@angular/core";

@Component({
  selector: "d-column",
  template: ``
})
export class ColumnComponent implements OnInit {
  @Input() label: string;
  @Input() dataKey: string;
  @Input() hidden: boolean;
  @Input() width: string;
  sort = false;
  @Input() sortable = true;
  selectedForSearch = false;

  @ContentChild("columnTemplate", { static: false })
  columnTemplate: TemplateRef<any>;

  constructor() {
    this.hidden = false;
  }

  ngOnInit() {}
}
