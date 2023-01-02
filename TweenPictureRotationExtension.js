/*:
 * @plugindesc This plugin is addon for TweenPicture.js that adds animate rotation feature.
 * Version : 1.1
 * @author Creta Park (https://creft.me/cretapark)
 *
 * @help
 * This plugin is addon for TweenPicture.js that
 *  adds animate rotation feature.
 *  
 * Created by Creta Park (https://creft.me/cretapark)
 * 
 * License : MIT
 * GitHub page : https://github.com/creta5164/rmmv-tween-picture
 * Recommanded MV version : 1.6.2^
 * 
 * Limitation
 * 
 * This plugin may not be compatible with
 *  third party plugins that rotate pictures.
 * 
 * Usage
 * 
 * You must place this below TweenPicture plugin.
 * 
 * * All movements available here are applied
 *   to the Tween Picture's easing effect.
 * * All functions of this plugin do not wait for events.
 *   If you want to wait for the rotation animation to finish,
 *   specify a wait event after every rotation script event
 *   for as long as it takes.
 * 
 * Basic usage is simple, add below script event to rotate picture.
 * RotatePicture(<Picture ID>, <Degree>, <Duration frames>);
 * 
 * - Picture ID      : Picture's ID you want to rotate.
 * - Degree          : Destination degree of rotation.
 * - Duration frames : Duration of rotation move. (60 frames per second)
 *                     Set 0 to rotate immediately.
 * 
 * Note that, basic rotation is moves to closest way to target degree.
 * It never rotates over 180 degree way.
 * 
 * Example : Rotate to -45 degree to picture 1.
 *           (It'll be 315 degree.)
 * RotatePicture(1, -45, 60);
 * 
 * You can use this instead to rotate the arrival degree by its absolute value.
 * RotatePictureFixed(<Picture ID>, <Degree>, <Duration frames>);
 * 
 * - Picture ID      : Picture's ID you want to rotate.
 * - Degree          : Destination degree of rotation. (absolute)
 * - Duration frames : Duration of rotation move. (60 frames per second)
 *                     Set 0 to rotate immediately.
 * 
 * Using this will unconditionally rotate the picture
 *  from the current degree value to target degree value.
 * For example, when the picture is at 0 degrees,
 *  using 1080(360 x 3) will make it rotate 3 times.
 * 
 * Example : Rotate picture 1 by 1080 degrees for make it rotates 3 times.
 *           (Rotates 1080 degrees from the current angle of the picture)
 * 
 * RotatePicture(1, 1080, 300);
 * 
 * 
 */

if (typeof TweenPicture !== 'object')
    throw new Error('TweenPictureRotationExtension has depending TweenPicture');

function RotatePicture(id, destAngle, duration) {
    
    var picture = $gameScreen.picture(id);
    picture._fixedAngle = false;
    
    if (duration == 0) {
        
        picture._angle = TweenPicture.lerpAngle(picture.angle() * (Math.PI / 180), destAngle * (Math.PI / 180), 1) * (180 / Math.PI);
        return;
    }
    
    picture._fromAngle = picture.angle();
    picture._toAngle = destAngle;
    picture._angleDuration = picture._totalAngleDuration = duration;
}

function RotatePictureFixed(id, destAngle, duration) {
    
    var picture = $gameScreen.picture(id);
    picture._fixedAngle = true;
    
    if (duration == 0) {
        
        picture._angle = destAngle;
        return;
    }
    
    picture._fromAngle = picture.angle();
    picture._toAngle = destAngle;
    picture._angleDuration = picture._totalAngleDuration = duration;
}

(function() {
    
    const Deg2Rad = Math.PI / 180;
    const Rad2Deg = 180 / Math.PI;
    
    
    /* This function is part of Freya holmer's Mathfs library.
        
        MIT License
        
        Copyright (c) Freya Holmér
        
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
        
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
        
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
        
    */
    
    //https://github.com/FreyaHolmer/Mathfs/blob/73710f551ba7ca6238dc1755194d4850bc957c4b/Runtime/Mathfs.cs#L1221-L1226
    function lerpAngle(a, b, t) {
    
        var delta = repeat((b - a), (Math.PI * 2));
        
        if (delta > Math.PI)
            delta -= Math.PI * 2;
        
        return a + delta * t;
    }
    
    //https://github.com/FreyaHolmer/Mathfs/blob/73710f551ba7ca6238dc1755194d4850bc957c4b/Runtime/Mathfs.cs#L650
    function repeat(value, length) {
        
        return clamp( value - Math.floor( value / length ) * length, 0, length );
    }
    
    //https://github.com/FreyaHolmer/Mathfs/blob/73710f551ba7ca6238dc1755194d4850bc957c4b/Runtime/Mathfs.cs#L350
    function clamp(value, min, max) {
        
        if( value < min ) value = min;
        if( value > max ) value = max;
        
        return value;
    }
    
    //End of Mathfs features
    
    TweenPicture.lerpAngle = lerpAngle;
    
    var Game_Picture_initTarget = Game_Picture.prototype.initTarget;
    Game_Picture.prototype.initTarget = function() {
        
        Game_Picture_initTarget.call(this);
        
        this._fromAngle = this._angle;
        this._fixedAngle = false;
        
        this._angleDuration = 0;
    }
    
    Game_Picture.prototype.normalizedAngleTweenTime = function() {
        
        if (this._easing in TweenPicture.Ease)
            return TweenPicture.Ease[this._easing](1 - (this._angleDuration / this._totalAngleDuration));
        
        return TweenPicture.Ease.linear(1 - (this._angleDuration / this._totalAngleDuration));
    }
    
    Game_Picture.prototype.updateRotation = function() {
        
        if (this._angleDuration > 0) {
            
            var t = this.normalizedAngleTweenTime();
            
            if (!this._fixedAngle)
                this._angle = lerpAngle(this._fromAngle * Deg2Rad, this._toAngle * Deg2Rad, t) * Rad2Deg;
            
            else
                this._angle = this._fromAngle - (this._toAngle - this._fromAngle) * t;
            
            this._angleDuration--;
            
            if (this._angleDuration <= 0) {
                
                this._angle = this._toAngle;
            }
        }
    }
})();