import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

import { GaugeSettings, Variable, GaugeStatus, Event } from '../../../_models/hmi';
import { GaugeBaseComponent } from '../../gauge-base/gauge-base.component';
import { GaugeDialogType } from '../../gauge-property/gauge-property.component';
import { Utils } from '../../../_helpers/utils';
import { CheckPermissionFunction } from '../../../_services/auth.service';
import { OneControlButtonComponent, OneControlOptions } from './onecontrol-button/onecontrol-button.component';

@Injectable()
export class OneControlComponent extends GaugeBaseComponent {

    static TypeTag = 'svg-ext-own_ctrl-onecontrol';
    static LabelTag = 'OneControl';
    static prefixD = 'D-OXC_';

    constructor() {
        super();
    }

    static getSignals(pro: any) {
        let res: string[] = [];
        // the displayed number is driven by the incoming feedback tag (separate from the command tag written on +/-)
        if (pro.options?.feedbackVariableId) {
            res.push(pro.options.feedbackVariableId);
        }
        return res;
    }

    static getDialogType(): GaugeDialogType {
        return GaugeDialogType.OneControl;
    }

    static bindEvents(ga: GaugeSettings, widget?: OneControlButtonComponent, callback?: any): Event {
        if (widget) {
            widget.bindUpdate((val) => {
                let event = new Event();
                event.type = 'on';
                event.ga = ga;
                event.value = val;
                if (callback) {
                    callback(event);
                }
            });
        }
        return null;
    }

    static processValue(ga: GaugeSettings, svgele: any, sig: Variable, gaugeStatus: GaugeStatus, widget?: OneControlButtonComponent) {
        try {
            if (widget) {
                let value = parseFloat(sig.value);
                if (Number.isNaN(value)) {
                    value = Number(sig.value);
                }
                widget.setFeedbackValue(value);
            }
        } catch (err) {
            console.error(err);
        }
    }

    static initElement(ga: GaugeSettings, resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef,
                       isview?: boolean, checkPermission?: CheckPermissionFunction): OneControlButtonComponent {
        let ele = document.getElementById(ga.id);
        if (ele) {
            ele?.setAttribute('data-name', ga.name);
            let container = Utils.searchTreeStartWith(ele, this.prefixD);
            if (container) {
                const factory = resolver.resolveComponentFactory(OneControlButtonComponent);
                const componentRef = viewContainerRef.createComponent(factory);
                container.innerHTML = '';

                componentRef.changeDetectorRef.detectChanges();
                const loaderComponentElement = componentRef.location.nativeElement;
                container.appendChild(loaderComponentElement);

                componentRef.instance['myComRef'] = componentRef;
                const options = <OneControlOptions>(ga.property?.options || new OneControlOptions());
                if (ga.property?.text) {
                    options.label = ga.property.text;
                }
                componentRef.instance.setOptions(options);
                componentRef.instance.isReadonly = !isview;
                componentRef.instance['name'] = ga.name;

                if (isview && checkPermission) {
                    const permission = checkPermission(ga.property);
                    if (permission?.enabled === false) {
                        componentRef.instance.setDisabled(true);
                    }
                }
                return componentRef.instance;
            }
        }
        return null;
    }
}
