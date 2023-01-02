/*:
 * @plugindesc This RPG Maker MV plugin simply adds easing feature to the movement and tone changes of the Picture.
 * Version : 1.1
 * @author Creta Park (https://creft.me/cretapark)
 *
 * @help
 * This RPG Maker MV plugin simply adds easing feature
 *  to the movement and tone changes of the Picture.
 * 
 * Created by Creta Park (https://creft.me/cretapark)
 * 
 * License : MIT
 * GitHub page : https://github.com/creta5164/rmmv-tween-picture
 * Recommanded MV version : 1.6.2^
 * 
 * * Before use this, take a look at https://easings.net/
 *   for understand easing features.
 * 
 * Limitation
 * 
 * This plugin does not support rotation due to differences
 *  in RPG Maker's intent and design.
 * But you can implement rotate with easing feature
 *  with TweenPictureRotationExtension plugin.
 * 
 * Usage
 * 
 * If you want to use easing to picture at moment,
 *  add below script event before move / change tone of picture event :
 * SetPictureEase(<Picture ID>, <Easing type>);
 * 
 * - Picture ID  : Picture's ID you want to add easing.
 * - Easing type : Easing type you want to apply to picture.
 * 
 * Example : Use Easing as BounceOut to picture 1.
 * SetPictureEase(1, 'BounceOut');
 * 
 * 
 * If you want to reset easing to default easing type of picture,
 *  add below script event :
 * SetPictureEase(<Picture ID>);
 * 
 * - Picture ID : Picture's ID you want to reset easing type.
 * 
 * Example : Reset Easing to plugin's default type to picture 1.
 * SetPictureEase(1);
 * 
 * 
 * You can use shake effect to picture with this :
 * ShakePicture(<Picture ID>, <Destination amount>, <Duration>);
 * 
 * - Picture ID : Picture's ID you want to take shake effect.
 * - Destination amount : Shake amount you want to finish duration.
 * - Duration : Duration of shake effect will take to finish.
 * * Destination amount will applied by easing type.
 * * This doesn't wait event.
 *   If you want to wait until finish this effect,
 *   add delay event after this script event.
 * 
 * Example : Apply shake intensity of 10 to picture 1 over 60 frames
 * ShakePicture(1, 10, 60);
 * 
 * 
 * Available ease list :
 *  - Linear
 *  - QuadIn
 *  - QuadOut
 *  - QuadInOut
 *  - CubicIn
 *  - CubicOut
 *  - CubicInOut
 *  - QuartIn
 *  - QuartOut
 *  - QuartInOut
 *  - QuintIn
 *  - QuintOut
 *  - QuintInOut
 *  - SineIn
 *  - SineOut
 *  - SineInOut
 *  - BackIn
 *  - BackOut
 *  - BackInOut
 *  - CircIn
 *  - CircOut
 *  - CircInOut
 *  - BounceIn
 *  - BounceOut
 *  - BounceInOut
 *  - ElasticIn
 *  - ElasticOut
 *  - ElasticInOut
 * 
 * @param default-ease
 * @text Default ease type
 * @desc Sets default easing type of picture transition.
 * @default Linear
 * @type select
 * @option Linear
 * @option QuadIn
 * @option QuadOut
 * @option QuadInOut
 * @option CubicIn
 * @option CubicOut
 * @option CubicInOut
 * @option QuartIn
 * @option QuartOut
 * @option QuartInOut
 * @option QuintIn
 * @option QuintOut
 * @option QuintInOut
 * @option SineIn
 * @option SineOut
 * @option SineInOut
 * @option BackIn
 * @option BackOut
 * @option BackInOut
 * @option CircIn
 * @option CircOut
 * @option CircInOut
 * @option BounceIn
 * @option BounceOut
 * @option BounceInOut
 * @option ElasticIn
 * @option ElasticOut
 * @option ElasticInOut
 */

function SetPictureEase(id, ease) {
    
    let target = $gameScreen.picture(id);
    
    if (target)
        target._easing = ease;
}

function ShakePicture(id, destPower, duration) {
    
    let target = $gameScreen.picture(id);
    
    if (target)
        target.shake(destPower, duration);
}

let TweenPicture = {};

(function() {
    
    Math.lerp = function(a, b, t) {
        return (1 - t) * a + t * b;
    }
    
    var Game_Picture_initTarget = Game_Picture.prototype.initTarget;
    Game_Picture.prototype.initTarget = function() {
        
        Game_Picture_initTarget.call(this);
        
        this._totalDuration = 0;
        
        this._sourceX = this._x;
        this._sourceY = this._y;
        
        this._fromX       = this._sourceX;
        this._fromY       = this._sourceY;
        this._fromScaleX  = this._scaleX;
        this._fromScaleY  = this._scaleY;
        this._fromOpacity = this._opacity;
        
        this._shakeDuration      = 0;
        this._totalShakeDuration = 0;
        
        this._shakePower  = 0;
        this._fromShake   = 0;
        this._targetShake = 0;
        
        this._easing = defaultEase;
    };
    
    var Game_Picture_initTone = Game_Picture.prototype.initTone
    Game_Picture.prototype.initTone = function() {
        
        Game_Picture_initTone.call(this);
        
        this._fromTone = null;
        this._toneTotalDuration = 0;
    };
    
    var Game_Picture_move = Game_Picture.prototype.move;
    Game_Picture.prototype.move = function() {
        
        Game_Picture_move.apply(this, arguments);
        
        this._fromX       = this._sourceX;
        this._fromY       = this._sourceY;
        this._fromScaleX  = this._scaleX;
        this._fromScaleY  = this._scaleY;
        this._fromOpacity = this._opacity;
        
        this._totalDuration = this._duration;
        
        if (!(this._easing in Ease))
            this._easing = defaultEase;
    };
    
    var Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        
        Game_Picture_show.apply(this, arguments);
        
        this._sourceX = this._x;
        this._sourceY = this._y;
    };
    
    Game_Picture.prototype.shake = function(destPower, duration) {
        
        if (duration <= 0) {
            
            this._totalShakeDuration = this._shakeDuration = 0;
            this._shakePower = destPower;
            return;
        }
        
        this._totalShakeDuration = this._shakeDuration = duration;
        this._fromShake   = this._shakePower;
        this._targetShake = destPower;
    };
    
    var Game_Picture_tint = Game_Picture.prototype.tint;
    Game_Picture.prototype.tint = function(tone, duration) {
        
        Game_Picture_tint.call(this, tone, duration);
        
        if (this._toneDuration > 0) {
            
            this._fromTone = this._tone.clone();
            this._toneTotalDuration = duration;
        }
    };
    
    Game_Picture.prototype.normalizedTweenTime = function() {
        
        if (this._easing in Ease)
            return Ease[this._easing](1 - (this._duration / this._totalDuration));
        
        return Ease.Linear(1 - (this._duration / this._totalDuration));
    }
    
    Game_Picture.prototype.normalizedToneTweenTime = function() {
        
        if (this._easing in Ease)
            return Ease[this._easing](1 - (this._toneDuration / this._toneTotalDuration));
        
        return Ease.Linear(1 - (this._toneDuration / this._toneTotalDuration));
    }
    
    Game_Picture.prototype.normalizedShakeTweenTime = function() {
        
        if (this._easing in Ease)
            return Ease[this._easing](1 - (this._shakeDuration / this._totalShakeDuration));
        
        return Ease.Linear(1 - (this._shakeDuration / this._totalShakeDuration));
    }
    
    var Game_Picture_update = Game_Picture.prototype.update;
    Game_Picture.prototype.update = function() {
        
        Game_Picture_update.call(this);
        this.updateTween();
    }
    
    Game_Picture.prototype.updateTween = function() {
        
        //TODO : Add more features if necessary.
        this.updateShake();
    }
    
    Game_Picture.prototype.updateShake = function() {
        
        if (this._shakeDuration > 0) {
            
            var t = this.normalizedShakeTweenTime();
            
            this._shakePower = Math.lerp(this._fromShake, this._targetShake, t);
            
            this._shakeDuration--;
            
            if (this._shakeDuration <= 0) {
                
                this._shakePower = this._targetShake;
            }
        }
        
        if (this._shakePower <= 0) {
            
            this._x = this._sourceX;
            this._y = this._sourceY;
            
        } else {
            
            this._x = this._sourceX + ((Math.random() - 0.5) * 2) * this._shakePower;
            this._y = this._sourceY + ((Math.random() - 0.5) * 2) * this._shakePower;
        }
    }
    
    var Game_Picture_updateMove = Game_Picture.prototype.updateMove;
    Game_Picture.prototype.updateMove = function() {
        
        Game_Picture_updateMove.call(this);
        this.updateTweenMove();
    };
    
    Game_Picture.prototype.updateTweenMove = function() {
        
        if (this._duration > 0) {
            
            var t = this.normalizedTweenTime();
            
            this._sourceX = Math.lerp(this._fromX,       this._targetX,       t);
            this._sourceY = Math.lerp(this._fromY,       this._targetY,       t);
            this._scaleX  = Math.lerp(this._fromScaleX,  this._targetScaleX,  t);
            this._scaleY  = Math.lerp(this._fromScaleY,  this._targetScaleY,  t);
            this._opacity = Math.lerp(this._fromOpacity, this._targetOpacity, t);
            
        } else {
            
            this._sourceX = this._targetX;
            this._sourceY = this._targetY;
            this._scaleX  = this._targetScaleX;
            this._scaleY  = this._targetScaleY;
            this._opacity = this._targetOpacity;
        }
    };

    Game_Picture.prototype.updateTone = function() {
        
        if (this._toneDuration > 0) {
            
            var t = this.normalizedToneTweenTime();
            
            for (var i = 0; i < 4; i++)
                this._tone[i] = Math.lerp(this._fromTone[i], this._toneTarget[i], t);
            
                this._toneDuration--;
            
            if (this._toneDuration <= 0) {
                
                for (var i = 0; i < 4; i++)
                    this._tone[i] = this._toneTarget[i];
            }
        }
    };
    
    ////////////////////////////// Begin of Ease.js //////////////////////////////
    //Embedded source code is modified for compatibility.
    /*
    * Ease
    * Visit http://createjs.com/ for documentation, updates and examples.
    *
    * Copyright (c) 2010 gskinner.com, inc.
    *
    * Permission is hereby granted, free of charge, to any person
    * obtaining a copy of this software and associated documentation
    * files (the "Software"), to deal in the Software without
    * restriction, including without limitation the rights to use,
    * copy, modify, merge, publish, distribute, sublicense, and/or sell
    * copies of the Software, and to permit persons to whom the
    * Software is furnished to do so, subject to the following
    * conditions:
    *
    * The above copyright notice and this permission notice shall be
    * included in all copies or substantial portions of the Software.
    *
    * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    * OTHER DEALINGS IN THE SOFTWARE.
    */
    
    var Ease = TweenPicture.Ease = {};
    
    Ease.Linear = function(t) { return t; };
    Ease.None = Ease.Linear;
    Ease.get = function(amount) {
        if (amount < -1) { amount = -1; }
        else if (amount > 1) { amount = 1; }
        return function(t) {
            if (amount==0) { return t; }
            if (amount<0) { return t*(t*-amount+1+amount); }
            return t*((2-t)*amount+(1-amount));
        };
    };
    Ease.getPowIn = function(pow) {
        return function(t) {
            return Math.pow(t,pow);
        };
    };
    Ease.getPowOut = function(pow) {
        return function(t) {
            return 1-Math.pow(1-t,pow);
        };
    };
    Ease.getPowInOut = function(pow) {
        return function(t) {
            if ((t*=2)<1) return 0.5*Math.pow(t,pow);
            return 1-0.5*Math.abs(Math.pow(2-t,pow));
        };
    };
    Ease.getBackIn = function(amount) {
        return function(t) {
            return t*t*((amount+1)*t-amount);
        };
    };
    Ease.getBackOut = function(amount) {
        return function(t) {
            return (--t*t*((amount+1)*t + amount) + 1);
        };
    };
    Ease.getBackInOut = function(amount) {
        amount*=1.525;
        return function(t) {
            if ((t*=2)<1) return 0.5*(t*t*((amount+1)*t-amount));
            return 0.5*((t-=2)*t*((amount+1)*t+amount)+2);
        };
    };
    Ease.getElasticIn = function(amplitude,period) {
        var pi2 = Math.PI*2;
        return function(t) {
            if (t==0 || t==1) return t;
            var s = period/pi2*Math.asin(1/amplitude);
            return -(amplitude*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/period));
        };
    };
    Ease.getElasticOut = function(amplitude,period) {
        var pi2 = Math.PI*2;
        return function(t) {
            if (t==0 || t==1) return t;
            var s = period/pi2 * Math.asin(1/amplitude);
            return (amplitude*Math.pow(2,-10*t)*Math.sin((t-s)*pi2/period )+1);
        };
    };
    Ease.getElasticInOut = function(amplitude,period) {
        var pi2 = Math.PI*2;
        return function(t) {
            var s = period/pi2 * Math.asin(1/amplitude);
            if ((t*=2)<1) return -0.5*(amplitude*Math.pow(2,10*(t-=1))*Math.sin( (t-s)*pi2/period ));
            return amplitude*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*pi2/period)*0.5+1;
        };
    };
    Ease.QuadIn     = Ease.getPowIn(2);
    Ease.QuadOut    = Ease.getPowOut(2);
    Ease.QuadInOut  = Ease.getPowInOut(2);
    Ease.CubicIn    = Ease.getPowIn(3);
    Ease.CubicOut   = Ease.getPowOut(3);
    Ease.CubicInOut = Ease.getPowInOut(3);
    Ease.QuartIn    = Ease.getPowIn(4);
    Ease.QuartOut   = Ease.getPowOut(4);
    Ease.QuartInOut = Ease.getPowInOut(4);
    Ease.QuintIn    = Ease.getPowIn(5);
    Ease.QuintOut   = Ease.getPowOut(5);
    Ease.QuintInOut = Ease.getPowInOut(5);
    Ease.SineIn     = function(t) { return 1-Math.cos(t*Math.PI/2);        };
    Ease.SineOut    = function(t) { return Math.sin(t*Math.PI/2);          };
    Ease.SineInOut  = function(t) { return -0.5*(Math.cos(Math.PI*t) - 1); };
    Ease.BackIn     = Ease.getBackIn(1.7);
    Ease.BackOut    = Ease.getBackOut(1.7);
    Ease.BackInOut  = Ease.getBackInOut(1.7);
    Ease.CircIn     = function(t) { return -(Math.sqrt(1-t*t)- 1); };
    Ease.CircOut    = function(t) { return Math.sqrt(1-(--t)*t);   };
    Ease.CircInOut  = function(t) {
        if ((t*=2) < 1) return -0.5*(Math.sqrt(1-t*t)-1);
        return 0.5*(Math.sqrt(1-(t-=2)*t)+1);
    };
    Ease.BounceIn = function(t) {
        return 1-Ease.BounceOut(1-t);
    };
    Ease.BounceOut = function(t) {
        if (t < 1/2.75) {
            return (7.5625*t*t);
        } else if (t < 2/2.75) {
            return (7.5625*(t-=1.5/2.75)*t+0.75);
        } else if (t < 2.5/2.75) {
            return (7.5625*(t-=2.25/2.75)*t+0.9375);
        } else {
            return (7.5625*(t-=2.625/2.75)*t +0.984375);
        }
    };
    Ease.BounceInOut = function(t) {
        if (t<0.5) return Ease.bounceIn (t*2) * .5;
        return Ease.BounceOut(t*2-1)*0.5+0.5;
    };
    Ease.ElasticIn    = Ease.getElasticIn(1,0.3);
    Ease.ElasticOut   = Ease.getElasticOut(1,0.3);
    Ease.ElasticInOut = Ease.getElasticInOut(1,0.3*1.5);
    ////////////////////////////// End of Ease.js //////////////////////////////
    
    var defaultEase = PluginManager.parameters('TweenPicture')["default-ease"];
    if (!(defaultEase in Ease))
        defaultEase = 'Linear';
})();