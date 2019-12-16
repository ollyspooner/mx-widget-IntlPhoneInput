define( [
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "mx-widget-IntlPhoneInput/lib/intlTelInput",
    "mx-widget-IntlPhoneInput/lib/utils",
    "dojo/_base/event",

], function ( declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, intlTelInput ) {
    "use strict";

    return declare( "mx-widget-IntlPhoneInput.widget.mx-widget-IntlPhoneInput", [ _WidgetBase ], {

        // Parameters configured in the Modeler.

        //Display tab
        phoneNumberSelector: "",
        phoneNumberAttributes: [],
        allowDropdown: null,
        autoHideDialCode: null,
        autoPlaceholder: "",
        placeholderNumberType: "",
        separateDialCode: null,
        
        //Formatting tab
        formatOnDisplay: null,
        nationalMode: null,

        //Countries tab 
        initialCountry: "",
        preferredCountries: [],
        onlyCountries: [],
        excludeCountries: [],
        localizedCountries: [],

        // Internal variables.
        _handles: null,
        _contextObj: null,

        // When the widget is initialised. Use for handles for timeouts, observers etc.
        constructor: function () {
            this._handles = [];
        },

        // Called after the widget DOM has been created.
        postCreate: function () {
            logger.debug( this.id + ".postCreate" );
        },

        // Called as the client applies context to the widget (i.e. the widget has data).
        update: function ( obj, callback ) {
            var this2 = this;

            logger.debug( this.id + ".update" );

            var inputElement = document.querySelector( "." + this.phoneNumberSelector + " input" );

            var excludeCountries = [];
            for( var i = 0; i < this.excludeCountries.length; i++ ) {
                excludeCountries.push(this.excludeCountries[i].country);
            }

            var onlyCountries = [];
            for( var i = 0; i < this.onlyCountries.length; i++ ) {
                onlyCountries.push( this.onlyCountries[i].country );
            }

            var preferredCountries = [];
            for( var i = 0; i < this.preferredCountries.length; i++ ) {
                preferredCountries.push( this.preferredCountries[i].country );
            }

            var localizedCountries = {};
            for( var i = 0; i < this.localizedCountries.length; i++ ) {
                localizedCountries[ this.localizedCountries[i].country ] = this.localizedCountries[i].translation;
            }

            var iti = window.intlTelInput( inputElement, {
                allowDropdown: this.allowDropdown,
                autoHideDialCode: this.autoHideDialCode,
                autoPlaceholder: this.autoPlaceholder,
                excludeCountries: excludeCountries,
                formatOnDisplay: this.formatOnDisplay,
                initialCountry: this.initialCountry,
                localizedCountries: localizedCountries,
                nationalMode: this.nationalMode,
                onlyCountries: onlyCountries,
                placeholderNumberType: this.placeholderNumberType,
                preferredCountries: preferredCountries,
                separateDialCode: this.separateDialCode,

                utilsScript: "../../build/js/utils.js?1575016932390" // just for formatting/placeholders etc
            } );

            inputElement.addEventListener( 'change', function() {
                for( var i = 0; i < this2.phoneNumberAttributes.length; i++ ) {
                    var attribute = this2.phoneNumberAttributes[i];
                    var number = iti.getNumber( intlTelInputUtils.numberFormat[ attribute.phoneNumberAttributeFormat ] );
                    this2._contextObj.set( attribute.phoneNumberAttribute, number );
                }
                this2._updateRendering( callback );
            } );
            
            this._contextObj = obj;
            this._updateRendering( callback );
        },

        resize: function ( box ) {
            logger.debug( this.id + ".resize" );
        },

        uninitialize: function () {
            logger.debug( this.id + ".uninitialize" );
        },

        _updateRendering: function ( callback ) {
            logger.debug( this.id + "._updateRendering" );

            if ( this._contextObj !== null ) {
                dojoStyle.set( this.domNode, "display", "block" );
            } else {
                dojoStyle.set( this.domNode, "display", "none" );
            }
            this._executeCallback( callback, "_updateRendering" );
        },

        // Shorthand for running a microflow
        _execMf: function ( mf, guid, cb ) {
            logger.debug( this.id + "._execMf" );
            if ( mf && guid ) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [ guid ]
                    },
                    callback: lang.hitch( this, function ( objs ) {
                        if ( cb && typeof cb === "function" ) {
                            cb( objs );
                        }
                    } ),
                    error: function ( error ) {
                        console.debug( error.description );
                    }
                }, this );
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function ( cb, from ) {
            logger.debug( this.id + "._executeCallback" + ( from ? " from " + from : "" ) );
            if ( cb && typeof cb === "function" ) {
                cb();
            }
        }
    });
});

require( [ "mx-widget-IntlPhoneInput/widget/mx-widget-IntlPhoneInput" ] );
