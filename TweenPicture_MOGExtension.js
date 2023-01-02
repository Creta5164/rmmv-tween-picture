/*:
 * @plugindesc This plugin is addon for TweenPicture.js that migrates with MOG_PictureEffects plugin.
 * Version : 1.1
 * @author Creta Park (https://creft.me/cretapark)
 *
 * @help
 * This plugin is addon for TweenPicture.js that
 *  migrates with MOG_PictureEffects plugin.
 *  
 * Created by Creta Park (https://creft.me/cretapark)
 * 
 * License : MIT
 * GitHub page : https://github.com/creta5164/rmmv-tween-picture
 * Recommanded MV version : 1.6.2^
 * 
 * You must place TweenPicture and this plugin below
 * of MOG_PictureEffects.
 */

(function() {
    
    if (typeof SetPictureEase === 'undefined') {
        
        console.warn('[TweenPicture_MOGExtension] No TweenPicture plugins detected, this plugin will disabled.');
        return;
    }
    
    if (typeof Moghunter === 'undefined') {
        
        console.warn('[TweenPicture_MOGExtension] No Moghunter plugins detected, this plugin will disabled.');
        return;
    }
    
    var Game_Picture_initTarget = Game_Picture.prototype.initTarget;
    Game_Picture.prototype.initTarget = function() {
        
        this._tpX = this._x;
        this._tpY = this._y;
        
        Game_Picture_initTarget.call(this);
    }
    
    var Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        
        this._tpX = this._x;
        this._tpY = this._y;
        this._tpScaleX  = this._scaleX;
        this._tpScaleY  = this._scaleY;
        this._tpOpacity = this._opacity;
        
        Game_Picture_show.apply(this, arguments);
    }
    
    var Game_Picture_updateShake = Game_Picture.prototype.updateShake;
    Game_Picture.prototype.updateShake = function() {
        
        this._tpX = this._x;
        this._tpY = this._y;
        
        Game_Picture_updateShake.call(this);
    }
    
    Game_Picture.prototype.updateTweenMove = function() {
        
        if (this._duration > 0) {
            
            var t = this.normalizedTweenTime();
            
            this._sourceX   = Math.lerp(this._fromX,       this._targetX,       t);
            this._sourceY   = Math.lerp(this._fromY,       this._targetY,       t);
            this._tpScaleX  = Math.lerp(this._fromScaleX,  this._targetScaleX,  t);
            this._tpScaleY  = Math.lerp(this._fromScaleY,  this._targetScaleY,  t);
            this._tpOpacity = Math.lerp(this._fromOpacity, this._targetOpacity, t);
            
        } else {
            
            this._sourceX   = this._targetX;
            this._sourceY   = this._targetY;
            this._tpScaleX  = this._targetScaleX;
            this._tpScaleY  = this._targetScaleY;
            this._tpOpacity = this._targetOpacity;
        }
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
            
            this._tpX = this._sourceX;
            this._tpY = this._sourceY;
            
        } else {
            
            this._tpX = this._sourceX + ((Math.random() - 0.5) * 2) * this._shakePower;
            this._tpY = this._sourceY + ((Math.random() - 0.5) * 2) * this._shakePower;
        }
    }
    
    const MOG_POSITION_DATA_TYPE = 0;
    const MOG_POSITION_X = 0;
    const MOG_POSITION_Y = 1;
    const MOG_SHAKE_X  = 2;
    const MOG_SHAKE_Y  = 3;
    const MOG_SHAKE2_X = 2;
    const MOG_SHAKE2_Y = 3;
    const MOG_FLOAT_Y  = 3;
    const MOG_MOVE_X   = 1;
    const MOG_MOVE_Y   = 2;
    const MOG_BREATH_X = 2;
    const MOG_BREATH_Y = 3;
    
    Game_Picture.prototype.isMogPositionEffectEnabled = function() {
        
        return this._positionData[MOG_POSITION_DATA_TYPE] !== 0;
    }
    
    Game_Picture.prototype.x = function() {
        
        if (!this.isMogPositionEffectEnabled()) {
            
            return this._tpX;
        }
        
        var relativeX = this._position[MOG_POSITION_X] + this._tpX;
        
        return relativeX
             + this._shake[MOG_SHAKE_X]
             + this._shake2[MOG_SHAKE2_X]
             + this._moveEffect[MOG_MOVE_X];
    };
    
    Game_Picture.prototype.y = function() {
        
        if (!this.isMogPositionEffectEnabled()) {
            
            return this._tpY;
        }
        
        var relativeY = this._position[MOG_POSITION_Y] + this._tpY;
        
        return relativeY
             + this._shake[MOG_SHAKE_Y]
             + this._shake2[MOG_SHAKE2_Y]
             + this._floatEffect[MOG_FLOAT_Y]
             + this._moveEffect[MOG_MOVE_Y];
    };
    
    Game_Picture.prototype.scaleX = function() {
        return this._tpScaleX + this._breathEffect[MOG_BREATH_X];
    };
    
    Game_Picture.prototype.scaleY = function() {
        return this._tpScaleY + this._breathEffect[MOG_BREATH_Y];
    };
    
    Game_Picture.prototype.opacity = function() {
        return this._tpOpacity + (this._opacity - this._tpOpacity);
    };
    
})();