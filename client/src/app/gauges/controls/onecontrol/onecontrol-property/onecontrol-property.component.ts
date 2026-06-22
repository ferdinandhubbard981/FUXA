import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef as MatDialogRef, MAT_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GaugeProperty } from '../../../../_models/hmi';
import { FlexAuthComponent } from '../../../gauge-property/flex-auth/flex-auth.component';
import { FlexHeadComponent } from '../../../gauge-property/flex-head/flex-head.component';
import { OneControlOptions } from '../onecontrol-button/onecontrol-button.component';

@Component({
    selector: 'app-onecontrol-property',
    templateUrl: './onecontrol-property.component.html',
    styleUrls: ['./onecontrol-property.component.scss']
})
export class OneControlPropertyComponent {

    @ViewChild('flexhead', { static: false }) flexhead: FlexHeadComponent;
    @ViewChild('flexauth', { static: false }) flexauth: FlexAuthComponent;

    property: GaugeProperty;
    options: OneControlOptions;
    name: string;

    constructor(public dialogRef: MatDialogRef<OneControlPropertyComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.property = <GaugeProperty>JSON.parse(JSON.stringify(this.data.settings.property));
        if (!this.property) {
            this.property = new GaugeProperty();
        }
        this.name = this.data.settings.name;
        this.options = <OneControlOptions>this.property.options;
        if (!this.options) {
            this.options = new OneControlOptions();
        }
        if (!this.property.text) {
            this.property.text = this.options.label;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOkClick(): void {
        this.options.label = this.property.text;
        this.data.settings.property = this.flexhead ? this.flexhead.getProperty() : this.property;
        this.data.settings.property.text = this.property.text;
        this.data.settings.property.options = this.options;
        this.data.settings.property.permission = this.flexauth.permission;
        this.data.settings.property.permissionRoles = this.flexauth.permissionRoles;
        this.data.settings.name = this.flexauth.name;
    }
}
