import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import {MatDialog} from '@angular/material/dialog';
import {ResultsComponent} from './results.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public editorOptions: JsonEditorOptions;
  public data;
  @ViewChild(JsonEditorComponent, {static: false}) editor: JsonEditorComponent;
  serverUrl;
  execProgress = false;
  serverUrlFormControl = new FormControl('', [
    Validators.nullValidator,
    // Validators.pattern(new RegExp('(^http[s]?:\\/{2})|(^www)|(^\\/{1,2})')),
    Validators.required
  ]);
  form: FormGroup;
  results: {};


  constructor(private readonly httpClient: HttpClient,
              private readonly formBuilder: FormBuilder,
              private readonly dialog: MatDialog,
              private readonly snack: MatSnackBar) {
  }

  ngOnInit(): void {
    try {
      this.data = JSON.parse(localStorage.getItem('lastRule'));
    } catch (e) {
      this.data = {};
    }
    this.serverUrl = localStorage.getItem('serverUrl');
    this.form = this.formBuilder.group({
      rules: [this.data, []]
    });
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.modes = ['code', 'tree', 'form', 'text'];
    this.editorOptions.mode = 'code';
    // this.editorOptions.expandAll = true;
  }

  exec() {
    const rules = this.form.value.rules;
    // console.log(rules);
    if (!rules) {
      this.snack.open('Rules object required', 'Ok', {
        duration: 3000
      });
      return;
    }
    if (!this.serverUrl) {
      this.snack.open('Server url is required', 'Ok', {
        duration: 3000
      });
      return;
    }
    localStorage.setItem('lastRule', JSON.stringify(rules));
    this.execProgress = true;
    this.httpClient.post(this.serverUrl, rules).toPromise()
      .then(value => {
        this.execProgress = false;
        this.results = value;
        this.dialog.open(ResultsComponent, {
          disableClose: true,
          closeOnNavigation: true,
          width: '90%',
          data: {
            results: this.results
          }
        });
      })
      .catch(reason => {
        console.log(reason);
        this.execProgress = false;
        this.snack.open(reason && reason.message ? reason.message : 'Fails to exec your rules', 'Ok', {
          duration: 3000
        });
      });
  }

  addServerUrl() {
    if (this.serverUrlFormControl.valid) {
      const value = this.serverUrlFormControl.value;
      if (value.toString().startsWith('http://') || value.toString().startsWith('https://')) {
        this.serverUrl = value;
      } else {
        this.serverUrl = `https://${value}-daas.bfast.fahamutech.com/v2`;
      }
      try {
        localStorage.setItem('lastRule', JSON.stringify({applicationId: ''}));
        localStorage.setItem('serverUrl', this.serverUrl);
      } catch (e) {
        console.warn(e);
      }
    } else {
      this.snack.open('Please add a database server url', 'Ok', {
        duration: 3000
      });
    }
  }

  removeServerUrl() {
    this.serverUrl = false;
    localStorage.clear();
  }

  submit() {
  }
}
