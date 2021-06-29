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
        restrictToSiblings: "",
        phoneNumberAttributes: [],
        allowDropdown: null,
        autoHideDialCode: null,
        autoPlaceholder: "",
        placeholderNumberType: "",
        placeholderNumberTypeAttribute: null,
        separateDialCode: null,
        
        //Formatting tab
        formatOnDisplay: null,
        nationalMode: null,

        //Countries tab 
        initialCountry: "",
        initialCountryAttribute: null,
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
            this._contextObj = obj;
            var this2 = this;

            logger.debug( this.id + ".update" );

            if( this.restrictToSiblings == false ){
                var inputElement = document.querySelector( "." + this.phoneNumberSelector + " input" );
            } else {
                var parent = this.srcNodeRef.parentNode;
                var inputElement = parent.querySelector( "." + this.phoneNumberSelector + " input" );
            }


            var placeholderNumberType = this.placeholderNumberType;
            if( this.placeholderNumberTypeAttribute != "" ) {
                placeholderNumberType = this._contextObj.get( this.placeholderNumberTypeAttribute );
            }

            var initialCountry = this.initialCountry;
            if( this.initialCountryAttribute != "" ) {
                initialCountry = this._contextObj.get( this.initialCountryAttribute );
            }

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
                initialCountry: initialCountry,
                localizedCountries: localizedCountries,
                nationalMode: this.nationalMode,
                onlyCountries: onlyCountries,
                placeholderNumberType: placeholderNumberType,
                preferredCountries: preferredCountries,
                separateDialCode: this.separateDialCode,

                utilsScript: "../../build/js/utils.js?1575016932390" // just for formatting/placeholders etc
            } );

            var countryElements = document.querySelectorAll( "." + this.phoneNumberSelector + " .iti__country-list > .iti__country" );

            var keyupHandler = function() {
                for( var i = 0; i < this2.phoneNumberAttributes.length; i++ ) {
                    var attribute = this2.phoneNumberAttributes[i];
                    var number = iti.getNumber( intlTelInputUtils.numberFormat[ attribute.phoneNumberAttributeFormat ] );
                    this2._contextObj.set( attribute.phoneNumberAttribute, number );
                }
                if( this2.initialCountryAttribute != null ) {
                    this2._contextObj.set( this2.initialCountryAttribute, iti.selectedCountryData.iso2 );
                }
                this2._updateRendering( callback );
            }

            var countrySelectHandler = function() {
                if( this2.initialCountryAttribute != null ) {
                    var countryCode = this.dataset.countryCode;
                    if( typeof countryCode != 'undefined' ) {
                        this2._contextObj.set( this2.initialCountryAttribute, countryCode );
                    }
                }
                setTimeout( function() {
                    for( var i = 0; i < this2.phoneNumberAttributes.length; i++ ) {
                        var attribute = this2.phoneNumberAttributes[i];
                        var number = iti.getNumber( intlTelInputUtils.numberFormat[ attribute.phoneNumberAttributeFormat ] );
                        this2._contextObj.set( attribute.phoneNumberAttribute, number );
                    }
                }, 500 );
                this2._updateRendering( callback );
            }

            inputElement.addEventListener( 'keyup', keyupHandler );
            for( var i = 0; i < countryElements.length; i++ ) {
                var countryCode = countryElements[i].dataset.countryCode;
                countryElements[i].addEventListener( 'mouseup', countrySelectHandler );
            }
            keyupHandler();
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
