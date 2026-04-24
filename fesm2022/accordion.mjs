import * as i0 from '@angular/core';
import { inject, input, computed, afterRenderEffect, Directive, InjectionToken, ElementRef, booleanAttribute, model, contentChildren, signal } from '@angular/core';
import { DeferredContentAware, DeferredContent } from './_deferred-content-chunk.mjs';
import { Directionality } from '@angular/cdk/bidi';
import { _IdGenerator } from '@angular/cdk/a11y';
import { AccordionTriggerPattern, AccordionGroupPattern } from './_accordion-chunk.mjs';
import './_expansion-chunk.mjs';
import './_list-navigation-chunk.mjs';
import './_signal-like-chunk.mjs';
import '@angular/core/primitives/signals';
import './_pointer-event-manager-chunk.mjs';

class AccordionPanel {
  _deferredContentAware = inject(DeferredContentAware);
  id = input(inject(_IdGenerator).getId('ng-accordion-panel-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  visible = computed(() => this._pattern?.expanded() === true, ...(ngDevMode ? [{
    debugName: "visible"
  }] : []));
  _pattern;
  constructor() {
    afterRenderEffect(() => {
      this._deferredContentAware.contentVisible.set(this.visible());
    });
  }
  expand() {
    this._pattern?.open();
  }
  collapse() {
    this._pattern?.close();
  }
  toggle() {
    this._pattern?.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.10",
    ngImport: i0,
    type: AccordionPanel,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.2.10",
    type: AccordionPanel,
    isStandalone: true,
    selector: "[ngAccordionPanel]",
    inputs: {
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "role": "region"
      },
      properties: {
        "attr.id": "id()",
        "attr.aria-labelledby": "_pattern?.id()",
        "attr.inert": "!visible() ? true : null"
      }
    },
    exportAs: ["ngAccordionPanel"],
    hostDirectives: [{
      directive: DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.10",
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
        'role': 'region',
        '[attr.id]': 'id()',
        '[attr.aria-labelledby]': '_pattern?.id()',
        '[attr.inert]': '!visible() ? true : null'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }]
  }
});

const ACCORDION_GROUP = new InjectionToken('ACCORDION_GROUP');

class AccordionTrigger {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _accordionGroup = inject(ACCORDION_GROUP);
  panel = input.required(...(ngDevMode ? [{
    debugName: "panel"
  }] : []));
  id = input(inject(_IdGenerator).getId('ng-accordion-trigger-', true), ...(ngDevMode ? [{
    debugName: "id"
  }] : []));
  panelId = computed(() => this.panel().id(), ...(ngDevMode ? [{
    debugName: "panelId"
  }] : []));
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  expanded = model(false, ...(ngDevMode ? [{
    debugName: "expanded"
  }] : []));
  active = computed(() => this._pattern.active(), ...(ngDevMode ? [{
    debugName: "active"
  }] : []));
  _pattern;
  ngOnInit() {
    this._pattern = new AccordionTriggerPattern({
      ...this,
      element: () => this.element,
      accordionGroup: () => this._accordionGroup._pattern,
      accordionPanelId: this.panelId
    });
    this.panel()._pattern = this._pattern;
  }
  expand() {
    this._pattern.open();
  }
  collapse() {
    this._pattern.close();
  }
  toggle() {
    this._pattern.toggle();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.10",
    ngImport: i0,
    type: AccordionTrigger,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.2.10",
    type: AccordionTrigger,
    isStandalone: true,
    selector: "[ngAccordionTrigger]",
    inputs: {
      panel: {
        classPropertyName: "panel",
        publicName: "panel",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      },
      id: {
        classPropertyName: "id",
        publicName: "id",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      disabled: {
        classPropertyName: "disabled",
        publicName: "disabled",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      },
      expanded: {
        classPropertyName: "expanded",
        publicName: "expanded",
        isSignal: true,
        isRequired: false,
        transformFunction: null
      }
    },
    outputs: {
      expanded: "expandedChange"
    },
    host: {
      attributes: {
        "role": "button"
      },
      properties: {
        "attr.data-active": "active()",
        "id": "id()",
        "attr.aria-expanded": "expanded()",
        "attr.aria-controls": "_pattern.controls()",
        "attr.aria-disabled": "_pattern.disabled()",
        "attr.disabled": "_pattern.hardDisabled() ? true : null",
        "attr.tabindex": "_pattern.tabIndex()"
      }
    },
    exportAs: ["ngAccordionTrigger"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.10",
  ngImport: i0,
  type: AccordionTrigger,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionTrigger]',
      exportAs: 'ngAccordionTrigger',
      host: {
        '[attr.data-active]': 'active()',
        'role': 'button',
        '[id]': 'id()',
        '[attr.aria-expanded]': 'expanded()',
        '[attr.aria-controls]': '_pattern.controls()',
        '[attr.aria-disabled]': '_pattern.disabled()',
        '[attr.disabled]': '_pattern.hardDisabled() ? true : null',
        '[attr.tabindex]': '_pattern.tabIndex()'
      }
    }]
  }],
  propDecorators: {
    panel: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "panel",
        required: true
      }]
    }],
    id: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    expanded: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "expanded",
        required: false
      }]
    }, {
      type: i0.Output,
      args: ["expandedChange"]
    }]
  }
});

class AccordionGroup {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  _triggers = contentChildren(AccordionTrigger, {
    ...(ngDevMode ? {
      debugName: "_triggers"
    } : {}),
    descendants: true
  });
  _triggerPatterns = computed(() => this._triggers().map(t => t._pattern), ...(ngDevMode ? [{
    debugName: "_triggerPatterns"
  }] : []));
  textDirection = inject(Directionality).valueSignal;
  disabled = input(false, {
    ...(ngDevMode ? {
      debugName: "disabled"
    } : {}),
    transform: booleanAttribute
  });
  multiExpandable = input(true, {
    ...(ngDevMode ? {
      debugName: "multiExpandable"
    } : {}),
    transform: booleanAttribute
  });
  softDisabled = input(true, {
    ...(ngDevMode ? {
      debugName: "softDisabled"
    } : {}),
    transform: booleanAttribute
  });
  wrap = input(false, {
    ...(ngDevMode ? {
      debugName: "wrap"
    } : {}),
    transform: booleanAttribute
  });
  _pattern = new AccordionGroupPattern({
    ...this,
    element: () => this.element,
    activeItem: signal(undefined),
    items: this._triggerPatterns,
    orientation: () => 'vertical'
  });
  expandAll() {
    this._pattern.expandAll();
  }
  collapseAll() {
    this._pattern.collapseAll();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.10",
    ngImport: i0,
    type: AccordionGroup,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.2.0",
    version: "21.2.10",
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
    host: {
      listeners: {
        "keydown": "_pattern.onKeydown($event)",
        "pointerdown": "_pattern.onPointerdown($event)",
        "focusin": "_pattern.onFocus($event)"
      }
    },
    providers: [{
      provide: ACCORDION_GROUP,
      useExisting: AccordionGroup
    }],
    queries: [{
      propertyName: "_triggers",
      predicate: AccordionTrigger,
      descendants: true,
      isSignal: true
    }],
    exportAs: ["ngAccordionGroup"],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.10",
  ngImport: i0,
  type: AccordionGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngAccordionGroup]',
      exportAs: 'ngAccordionGroup',
      host: {
        '(keydown)': '_pattern.onKeydown($event)',
        '(pointerdown)': '_pattern.onPointerdown($event)',
        '(focusin)': '_pattern.onFocus($event)'
      },
      providers: [{
        provide: ACCORDION_GROUP,
        useExisting: AccordionGroup
      }]
    }]
  }],
  propDecorators: {
    _triggers: [{
      type: i0.ContentChildren,
      args: [i0.forwardRef(() => AccordionTrigger), {
        ...{
          descendants: true
        },
        isSignal: true
      }]
    }],
    disabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    multiExpandable: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "multiExpandable",
        required: false
      }]
    }],
    softDisabled: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }],
    wrap: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }]
  }
});

class AccordionContent {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.10",
    ngImport: i0,
    type: AccordionContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.2.10",
    type: AccordionContent,
    isStandalone: true,
    selector: "ng-template[ngAccordionContent]",
    hostDirectives: [{
      directive: DeferredContent
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.10",
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

export { AccordionContent, AccordionGroup, AccordionPanel, AccordionTrigger, DeferredContent as ɵɵDeferredContent, DeferredContentAware as ɵɵDeferredContentAware };
//# sourceMappingURL=accordion.mjs.map
