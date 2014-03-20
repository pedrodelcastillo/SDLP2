/*
 * Copyright (c) 2013, Ford Motor Company All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: ·
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. · Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. · Neither the name of the Ford Motor Company nor the
 * names of its contributors may be used to endorse or promote products derived
 * from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
/*
 * Reference implementation of UI component.
 *
 * Interface to get or set some essential information sent from SDLCore. UI is
 * responsible for the functionality provided by the application: display
 * graphics and multimedia components, is responsible for the transfer of
 * managed manipulations, generated by the user to the server.
 *
 */

FFW.UI = FFW.RPCObserver
    .create( {

        /**
         * If true then UI is present and ready to communicate with SDL.
         *
         * @type {Boolean}
         */
        isReady: false,

        /**
         * access to basic RPC functionality
         */
        client: FFW.RPCClient.create( {
            componentName: "UI"
        }),

        // temp var for debug
        appID: 1,

        onShowNotificationSubscribeRequestID: -1,

        onShowNotificationUnsubscribeRequestID: -1,

        // const
        onShowNotificationNotification: "UI.ShowNotification",

        /**
         * ids for requests AudioPassThru
         */
        performAudioPassThruRequestID: -1,
        endAudioPassThruRequestID: -1,

        /**
         * connect to RPC bus
         */
        connect: function() {

            this.client.connect(this, 400); // Magic number is unique identifier
            // for component
        },

        /**
         * disconnect from RPC bus
         */
        disconnect: function() {

            this.client.disconnect();
        },

        /**
         * Client is registered - we can send request starting from this point
         * of time
         */
        onRPCRegistered: function() {

            Em.Logger.log("FFW.UI.onRPCRegistered");
            this._super();

            // subscribe to notifications
            this.onShowNotificationSubscribeRequestID = this.client
                .subscribeToNotification(this.onShowNotificationNotification);
        },

        /**
         * Client is unregistered - no more requests
         */
        onRPCUnregistered: function() {

            Em.Logger.log("FFW.UI.onRPCUnregistered");
            this._super();

            // unsubscribe from notifications
            this.onShowNotificationUnsubscribeRequestID = this.client
                .unsubscribeFromNotification(this.onShowNotificationNotification);
        },

        /**
         * Client disconnected.
         */
        onRPCDisconnected: function() {

        },

        /**
         * when result is received from RPC component this function is called It
         * is the propriate place to check results of request execution Please
         * use previously store reuqestID to determine to which request repsonse
         * belongs to
         */
        onRPCResult: function(response) {

            Em.Logger.log("FFW.UI.onRPCResult");
            this._super();
        },

        /**
         * handle RPC erros here
         */
        onRPCError: function(error) {

            Em.Logger.log("FFW.UI.onRPCError");
            this._super();
        },

        /**
         * handle RPC notifications here
         */
        onRPCNotification: function(notification) {

            Em.Logger.log("FFW.UI.onRPCNotification");
            this._super();

            if (notification.method == this.onShowNotificationNotification) {
                // to do
            }
        },

        /**
         * handle RPC requests here
         */
        onRPCRequest: function(request) {

            Em.Logger.log("FFW.UI.onRPCRequest");

            if (this.validationCheck(request)) {

                switch (request.method) {
                case "UI.Alert": {

                    SDL.SDLModel.onUIAlert(request.params, request.id);

                    break;
                }
                case "UI.Show": {

                    SDL.TurnByTurnView.deactivate();
                    SDL.SDLController.getApplicationModel(request.params.appID)
                        .onSDLUIShow(request.params);
                    this.sendUIResult(SDL.SDLModel.resultCode["SUCCESS"],
                        request.id,
                        request.method);

                    break;
                }
                case "UI.SetGlobalProperties": {

                    this.sendUIResult(SDL.SDLModel.resultCode["SUCCESS"],
                        request.id,
                        request.method);

                    break;
                }
                case "UI.ResetGlobalProperties": {

                    this.sendUIResult(SDL.SDLModel.resultCode["SUCCESS"],
                        request.id,
                        request.method);

                    break;
                }
                case "UI.AddCommand": {

                    SDL.SDLController.getApplicationModel(request.params.appID)
                        .addCommand(request);

                    break;
                }
                case "UI.DeleteCommand": {

                    SDL.SDLController.getApplicationModel(request.params.appID)
                        .deleteCommand(request.params.cmdID, request.id);

                    break;
                }
                case "UI.AddSubMenu": {

                    SDL.SDLController.getApplicationModel(request.params.appID)
                        .addSubMenu(request);

                    break;
                }
                case "UI.DeleteSubMenu": {

                    var resultCode = SDL.SDLController
                        .getApplicationModel(request.params.appID)
                        .deleteSubMenu(request.params.menuID);
                    this.sendUIResult(resultCode, request.id, request.method);

                    break;
                }
                case "UI.PerformInteraction": {

                    SDL.SDLModel.uiPerformInteraction(request.params,
                        request.id);

                    break;
                }
                case "UI.SetMediaClockTimer": {

                    var resultCode = SDL.SDLController
                        .getApplicationModel(request.params.appID)
                        .sdlSetMediaClockTimer(request.params);
                    if (resultCode === SDL.SDLModel.resultCode["SUCCESS"]) {
                        this.sendUIResult(resultCode,
                            request.id,
                            request.method);
                    } else {
                        this
                            .sendError(resultCode,
                                request.id,
                                request.method,
                                'Request is ignored, illegal parameters.');
                    }

                    break;
                }
                case "UI.Slider": {

                    SDL.SDLModel.uiSlider(request);

                    break;
                }
                case "UI.ScrollableMessage": {

                    SDL.SDLModel.onSDLScrolableMessage(request, request.id);

                    break;
                }
                case "UI.ChangeRegistration": {

                    SDL.SDLModel.changeRegistrationUI(request.params.language, request.params.appID);
                    this.sendUIResult(SDL.SDLModel.resultCode["SUCCESS"],
                        request.id,
                        request.method);

                    break;
                }
                case "UI.SetAppIcon": {

                    SDL.SDLModel.onSDLSetAppIcon(request.params,
                        request.id,
                        request.method);

                    break;
                }
                case "UI.PerformAudioPassThru": {

                    this.performAudioPassThruRequestID = request.id;
                    SDL.SDLModel.UIPerformAudioPassThru(request.params);

                    break;
                }
                case "UI.EndAudioPassThru": {

                    this.endAudioPassThruRequestID = request.id;

                    SDL.SDLModel.UIEndAudioPassThru();

                    break;
                }
                case "UI.GetSupportedLanguages": {

                    Em.Logger.log("FFW." + request.method + "Response");

                    var JSONMessage = {
                        "id": request.id,
                        "jsonrpc": "2.0",
                        "result": {
                            "code": SDL.SDLModel.resultCode["SUCCESS"], // type
                            // (enum)
                            // from
                            // SDL
                            "method": "UI.GetSupportedLanguages",
                            "languages": SDL.SDLModel.sdlLanguagesList
                        }
                    };
                    this.client.send(JSONMessage);

                    break;
                }
                case "UI.GetLanguage": {

                    Em.Logger.log("FFW." + request.method + "Response");

                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "code": SDL.SDLModel.resultCode["SUCCESS"], // type
                            // (enum)
                            // from
                            // SDL
                            "method": "UI.GetLanguage",
                            "language": SDL.SDLModel.hmiUILanguage
                        }
                    };
                    this.client.send(JSONMessage);

                    break;
                }
                case "UI.GetCapabilities": {
                    // send repsonse
                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "displayCapabilities": {
                                "displayType": "GEN2_8_DMA",
                                "textFields": [
                                    "mainField1",
                                    "mainField2",
                                    "mainField1",
                                    "mainField2",
                                    "statusBar",
                                    "mediaClock",
                                    "mediaTrack",
                                    "alertText1",
                                    "alertText2",
                                    "alertText3",
                                    "scrollableMessageBody",
                                    "initialInteractionText",
                                    "navigationText1",
                                    "navigationText2",
                                    "ETA",
                                    "totalDistance",
                                    "navigationText",
                                    "audioPassThruDisplayText1",
                                    "audioPassThruDisplayText2",
                                    "sliderHeader",
                                    "sliderFooter",
                                    "notificationText"
                                ],
                                "mediaClockFormats": [
                                    "CLOCK1",
                                    "CLOCK2",
                                    "CLOCK3",
                                    "CLOCKTEXT1",
                                    "CLOCKTEXT2",
                                    "CLOCKTEXT3",
                                    "CLOCKTEXT4"
                                ],
                                "imageCapabilities": [
                                    "DYNAMIC"
                                ]
                            },
                            "hmiZoneCapabilities": "FRONT",
                            "softButtonCapabilities": {
                                "shortPressAvailable": true,
                                "longPressAvailable": true,
                                "upDownAvailable": true,
                                "imageSupported": true
                            },
                            "code": SDL.SDLModel.resultCode["SUCCESS"],
                            "method": "UI.GetCapabilities"
                        }
                    };

                    this.client.send(JSONMessage);

                    break;
                }
                case "UI.IsReady": {

                    // send repsonse
                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "available": this.get('isReady'),
                            "code": SDL.SDLModel.resultCode["SUCCESS"],
                            "method": "UI.IsReady"
                        }
                    };

                    this.client.send(JSONMessage);

                    break;
                }
                case "UI.ClosePopUp": {

                    SDL.SDLController.closePopUp();

                    // send repsonse
                    var JSONMessage = {
                        "jsonrpc": "2.0",
                        "id": request.id,
                        "result": {
                            "code": SDL.SDLModel.resultCode["SUCCESS"],
                            "method": "UI.ClosePopUp"
                        }
                    };

                    this.client.send(JSONMessage);

                    break;
                }
                case "UI.ShowVrHelp": {

                    SDL.SDLModel.ShowVrHelp(request.params);

                    this.sendUIResult(SDL.SDLModel.resultCode["SUCCESS"],
                        request.id,
                        request.method);

                    break;
                }
                default: {
                    // statements_def
                    break;
                }
                }
            }
        },

        /**
         * Send error response from onRPCRequest
         *
         * @param {Number}
         *            resultCode
         * @param {Number}
         *            id
         * @param {String}
         *            method
         */
        sendError: function(resultCode, id, method, message) {

            Em.Logger.log("FFW." + method + "Response");

            if (resultCode !== 0) {

                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "id": id,
                    "error": {
                        "code": resultCode, // type (enum) from SDL protocol
                        "message": message,
                        "data": {
                            "method": method
                        }
                    }
                };
                this.client.send(JSONMessage);
            }
        },

        /**
         * send response from onRPCRequest
         *
         * @param {Number}
         *            resultCode
         * @param {Number}
         *            id
         * @param {String}
         *            method
         */
        sendUIResult: function(resultCode, id, method) {

            Em.Logger.log("FFW." + method + "Response");

            if (resultCode === SDL.SDLModel.resultCode["SUCCESS"]) {

                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "id": id,
                    "result": {
                        "code": resultCode, // type (enum) from SDL protocol
                        "method": method
                    }
                };
                this.client.send(JSONMessage);
            }
        },

        /**
         * send response from onRPCRequest
         *
         * @param {Number}
         *            resultCode
         * @param {Number}
         *            id
         */
        alertResponse: function(resultCode, id) {

            Em.Logger.log("FFW.UI.AlertResponse");

            if (resultCode === SDL.SDLModel.resultCode["SUCCESS"]) {

                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "id": id,
                    "result": {
                        "code": resultCode, // type (enum) from SDL protocol
                        "method": 'UI.Alert'
                    }
                };
                this.client.send(JSONMessage);
            } else {
                this.sendError(resultCode,
                    id,
                    "UI.Alert",
                    'Alert request aborted.');
            }
        },

        /**
         * send response from onRPCRequest
         *
         * @param {Number}
         *            resultCode
         * @param {Number}
         *            sliderRequestID
         * @param {Number}
         *            sliderPosition
         */
        sendSliderResult: function(resultCode, sliderRequestID, sliderPosition) {

            if (resultCode === SDL.SDLModel.resultCode["SUCCESS"]) {

                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "id": sliderRequestID,
                    "result": {
                        "code": resultCode, // type (enum) from SDL protocol
                        "method": 'UI.Slider'
                    }
                };

                if (sliderPosition) {
                    JSONMessage.result.sliderPosition = sliderPosition;
                }
            } else {
                // send repsonse
                var JSONMessage = {
                    "jsonrpc": "2.0",
                    "id": sliderRequestID,
                    "error": {
                        "code": resultCode, // type (enum) from SDL protocol
                        "message": 'Slider request aborted.',
                        "data":{
                            "method": 'UI.Slider'
                        }
                    }
                };

                if (sliderPosition) {
                    JSONMessage.error.data.sliderPosition = sliderPosition;
                }
            }

            this.client.send(JSONMessage);
        },

        /**
         * send notification when command was triggered
         *
         * @param {Number}
         *            commandID
         * @param {Number}
         *            appID
         */
        onCommand: function(commandID, appID) {

            Em.Logger.log("FFW.UI.onCommand");

            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "UI.OnCommand",
                "params": {
                    "cmdID": commandID,
                    "appID": appID
                }
            };
            this.client.send(JSONMessage);
        },

        /**
         * send notification when command was triggered
         *
         * @param {Number}
         *            softButtonID
         * @param {Number}
         *            appID
         */
        onCommandSoftButton: function(softButtonID, appID) {

            Em.Logger.log("FFW.UI.onCommand");

            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "UI.OnCommand",
                "params": {
                    "commandID": softButtonID,
                    "appID": appID
                }
            };
            this.client.send(JSONMessage);
        },

        /**
         * send notification when command was triggered
         *
         * @param {Number}
         *            resultCode
         * @param {Number}
         *            performInteractionRequestID
         * @param {Number}
         *            commandID
         */
        interactionResponse: function(resultCode, performInteractionRequestID,
            commandID) {

            Em.Logger.log("FFW.UI.PerformInteractionResponse");

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "id": performInteractionRequestID,
                "result": {
                    "code": resultCode,
                    "method": "UI.PerformInteraction"
                }
            };

            if (commandID) {
                JSONMessage.result.choiceID = commandID;
            }

            this.client.send(JSONMessage);
        },

        /**
         * send notification when DriverDistraction PopUp is visible
         *
         * @param {String}
         *            driverDistractionState
         */
        onDriverDistraction: function(driverDistractionState) {

            Em.Logger.log("FFW.UI.DriverDistraction");

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "UI.OnDriverDistraction",
                "params": {
                    "state": driverDistractionState
                }
            };
            this.client.send(JSONMessage);
        },

        /**
         * Notifies if system context is changed
         *
         * @param {String}
         *            systemContextValue
         */
        OnSystemContext: function(systemContextValue) {

            Em.Logger.log("FFW.UI.OnSystemContext");

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "UI.OnSystemContext",
                "params": {
                    "systemContext": systemContextValue
                }
            };
            this.client.send(JSONMessage);
        },

        /**
         * Notifies if sdl UI components language was changed
         *
         * @param {String}
         *            lang
         */
        OnLanguageChange: function(lang) {

            Em.Logger.log("FFW.UI.OnLanguageChange");

            // send repsonse
            var JSONMessage = {
                "jsonrpc": "2.0",
                "method": "UI.OnLanguageChange",
                "params": {
                    "language": lang
                }
            };
            this.client.send(JSONMessage);
        }
    })