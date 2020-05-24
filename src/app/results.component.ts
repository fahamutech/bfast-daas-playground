import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {JsonEditorOptions} from 'ang-jsoneditor';

@Component({
  templateUrl: 'results.component.html',
  styleUrls: ['./app.component.scss'],
  selector: 'app-result-dialog'
})
export class ResultsComponent implements OnInit {
  resultsJsonOptions = new JsonEditorOptions();

  constructor(public dialogRef: MatDialogRef<ResultsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {
                results: any
              }) {
  }

  ngOnInit(): void {
    this.resultsJsonOptions.modes = ['view'];
    this.resultsJsonOptions.mode = 'view';
    this.resultsJsonOptions.expandAll = true;
  }
}
