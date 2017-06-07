/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {

    },

    sendSms: function () {

        if (navigator.connection.type == Connection.NONE) {
            navigator.notification.alert('No Internet Connection');
        } else {
            $.ajax({
                type: "GET",
                url: "https://sms-a.herokuapp.com/number_list",
                contentType: "json",
                success: sendSms
            });

            function sendSms(result) {
                if (result.length == 0) {
                    navigator.notification.alert('No new Numbers..');
                } else {
                    console.log(JSON.stringify(result));
                    var options = {
                        replaceLineBreaks: false,
                        android: {
                            //intent: 'INTENT'
                            intent: ''
                        }
                    };
                    var error = function (e) {
                        console.log('Message Failed:' + e);
                    };                   
                    result.forEach(function (obj) {
                        sms.send(obj.mobile_number, obj.content, options, function () {
                            $.ajax({
                                type: "PUT",
                                url: "https://sms-a.herokuapp.com/number_list/" + obj._id,
                                success: function (data) {
                                    console.log('message sent successfully to ' + obj.mobile_number + ' with content ' + obj.content);
                                }
                            });
                        }, error);
                    });
                }
            }
        }
    },

    checkSMSPermission: function () {
        var success = function (hasPermission) {
            if (hasPermission) {
                //sms.send(...);
            }
            else {
                // show a helpful message to explain why you need to require the permission to send a SMS
                // read http://developer.android.com/training/permissions/requesting.html#explain for more best practices
            }
        };
        var error = function (e) { alert('Something went wrong:' + e); };
        sms.hasPermission(success, error);
    }
};

app.initialize();