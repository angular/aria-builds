import * as i0 from '@angular/core';
import { inject, input, computed, signal, afterRenderEffect, Directive, ElementRef, booleanAttribute, contentChildren, model } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import * as i1 from '@angular/aria/private';
import { DeferredContentAware, AccordionPanelPattern, AccordionTriggerPattern, AccordionGroupPattern, DeferredContent } from '@angular/aria/private';

class AccordionPanel {
  _deferredContentAware = inject(DeferredContentAware);
  _id = inject(_IdGenerator).getId('accordion-trigger-', true);
  panelId = input.required(...(ngDevMode ? [{
    debugName: "panelId"
  }] : []));
  visible = computed(() => !this._pattern.hidden(), ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  accordionTrigger = signal(undefined, ...(ngDevMode ? [{
    debugName: "accordionTrigger"
  }] : []));
  _pattern = new AccordionPanelPattern({
    id: () => this._id,
    panelId: this.panelId,
    accordionTrigger: () => this.accordionTrigger()
  });
  constructor() {
    afterRenderEffect(() => {
      this._deferredContentAware.contentVisible.set(this.visible());
    });
  }
  expand() {
    this.accordionTrigger()?.expansionControl.open();
  }
  collapse() {
    this.accordionTrigger()?.expansionControl.close();
  }
  toggle() {
    this.accordionTrigger()?.expansionControl.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: AccordionPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: AccordionPanel,
    isStandalone: true,
    selector: "[ngAccordionPanel]",
    inputs: {
      panelId: {
        classPropertyName: "panelId",
        publicName: "panelId",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "region"
      },
      properties: {
        "attr.id": "_pattern.id()",
        "attr.aria-labelledby": "_pattern.accordionTrigger()?.id()",
        "attr.inert": "!visible() ? true : null"
      },
      classAttribute: "ng-accordion-panel"
    },
    exportAs: ["ngAccordionPanel"],
    hostDirectives: [{
      directive: i1.DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: AccordionPanel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionPanel]',
      exportAs: 'ngAccordionPanel',
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ['preserveContent']
      }],
      host: {
        'class': 'ng-accordion-panel',
        'role': 'region',
        '[attr.id]': '_pattern.id()',
        '[attr.aria-labelledby]': '_pattern.accordionTrigger()?.id()',
        '[attr.inert]': '!visible() ? true : null'
      }
    }]
  }],
  ctorParameters: () => []
});
class AccordionTrigger {
  _id = inject(_IdGenerator).getId('ng-accordion-trigger-', true);
  _elementRef = inject(ElementRef);
  _accordionGroup = inject(AccordionGroup);
  panelId = input.required(...(ngDevMode ? [{
    debugName: "panelId"
  }] : []));
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  expanded = computed(() => this._pattern.expanded(), ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  hardDisabled = computed(() => this._pattern.disabled() && this._pattern.tabIndex() < 0, ...(ngDevMode ? [{
    debugName: "hardDisabled"
  }] : []));
  accordionPanel = signal(undefined, ...(ngDevMode ? [{
    debugName: "accordionPanel"
  }] : []));
  _pattern = new AccordionTriggerPattern({
    id: () => this._id,
    panelId: this.panelId,
    disabled: this.disabled,
    element: () => this._elementRef.nativeElement,
    accordionGroup: computed(() => this._accordionGroup._pattern),
    accordionPanel: this.accordionPanel
  });
  expand() {
    this._pattern.expansionControl.open();
  }
  collapse() {
    this._pattern.expansionControl.close();
  }
  toggle() {
    this._pattern.expansionControl.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: AccordionTrigger,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "20.2.0-next.2",
    type: AccordionTrigger,
    isStandalone: true,
    selector: "[ngAccordionTrigger]",
    inputs: {
      panelId: {
        classPropertyName: "panelId",
        publicName: "panelId",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "button"
      },
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_pattern.onFocus($event)"
      },
      properties: {
        "attr.data-active": "active()",
        "id": "_pattern.id()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-controls": "_pattern.controls()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.disabled": "hardDisabled() ? true : null",
        "attr.tabindex": "_pattern.tabIndex()"
      },
      classAttribute: "ng-accordion-trigger"
    },
    exportAs: ["ngAccordionTrigger"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: AccordionTrigger,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionTrigger]',
      exportAs: 'ngAccordionTrigger',
      host: {
        'class': 'ng-accordion-trigger',
        '[attr.data-active]': 'active()',
        'role': 'button',
        '[id]': '_pattern.id()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': '_pattern.controls()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.disabled]': 'hardDisabled() ? true : null',
        '[attr.tabindex]': '_pattern.tabIndex()',
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_pattern.onFocus($event)'
      }
    }]
  }]
});
class AccordionGroup {
  _elementRef = inject(ElementRef);
  _triggers = contentChildren(AccordionTrigger, ...(ngDevMode ? [{
    debugName: "_triggers",
    descendants: true
  }] : [{
    descendants: true
  }]));
  _panels = contentChildren(AccordionPanel, ...(ngDevMode ? [{
    debugName: "_panels",
    descendants: true
  }] : [{
    descendants: true
  }]));
  textDirection = inject(Directionality).valueSignal;
  disabled = input(false, ...(ngDevMode ? [{
    debugName: "disabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  multiExpandable = input(true, ...(ngDevMode ? [{
    debugName: "multiExpandable",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  expandedPanels = model([], ...(ngDevMode ? [{
    debugName: "expandedPanels"
  }] : []));
  softDisabled = input(true, ...(ngDevMode ? [{
    debugName: "softDisabled",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  wrap = input(false, ...(ngDevMode ? [{
    debugName: "wrap",
    transform: booleanAttribute
  }] : [{
    transform: booleanAttribute
  }]));
  _pattern = new AccordionGroupPattern({
    ...this,
    activeItem: signal(undefined),
    items: computed(() => this._triggers().map(trigger => trigger._pattern)),
    expandedIds: this.expandedPanels,
    orientation: () => 'vertical',
    element: () => this._elementRef.nativeElement
  });
  constructor() {
    afterRenderEffect(() => {
      const triggers = this._triggers();
      const panels = this._panels();
      for (const trigger of triggers) {
        const panel = panels.find(p => p.panelId() === trigger.panelId());
        trigger.accordionPanel.set(panel?._pattern);
        if (panel) {
          panel.accordionTrigger.set(trigger._pattern);
        }
      }
    });
  }
  expandAll() {
    this._pattern.expansionManager.openAll();
  }
  collapseAll() {
    this._pattern.expansionManager.closeAll();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: AccordionGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "20.2.0-next.2",
    type: AccordionGroup,
    isStandalone: true,
    selector: "[ngAccordionGroup]",
    inputs: {
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      multiExpandable: {
        classPropertyName: "multiExpandable",
        publicName: "multiExpandable",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      expandedPanels: {
        classPropertyName: "expandedPanels",
        publicName: "expandedPanels",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      softDisabled: {
        classPropertyName: "softDisabled",
        publicName: "softDisabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      wrap: {
        classPropertyName: "wrap",
        publicName: "wrap",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      expandedPanels: "expandedPanelsChange"
    },
    host: {
      classAttribute: "ng-accordion-group"
    },
    queries: [{
      propertyName: "_triggers",
      predicate: AccordionTrigger,
      descendants: true,
      isSignal: true
    }, {
      propertyName: "_panels",
      predicate: AccordionPanel,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngAccordionGroup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: AccordionGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionGroup]',
      exportAs: 'ngAccordionGroup',
      host: {
        'class': 'ng-accordion-group'
      }
    }]
  }],
  ctorParameters: () => []
});
class AccordionContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "20.2.0-next.2",
    ngImport: i0,
    type: AccordionContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "20.2.0-next.2",
    type: AccordionContent,
    isStandalone: true,
    selector: "ng-template[ngAccordionContent]",
    hostDirectives: [{
      directive: i1.DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "20.2.0-next.2",
  ngImport: i0,
  type: AccordionContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[ngAccordionContent]',
      hostDirectives: [DeferredContent]
    }]
  }]
});

export { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger };
//# sourceMappingURL=accordion.mjs.map
