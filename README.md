# Tween Picture

![preview](./preview.gif)

This RPG Maker MV plugin simply adds easing feature to the movement and tone changes of the Picture.

I first made it when I was making [Growing a Legendary Tree](http://galtgame.com/en.html), and I improved it as I uploaded it to the repository.  
Recommanded MV version : `1.6.2^`

> Before use this, take a look at https://easings.net for understand easing features.

## Limitation

This plugin does not support rotation due to differences in RPG Maker's intent and design.

## Usage

If you want to use easing to picture at moment, add below script event before move / change tone of picture event.

```
SetPictureEase(<Picture ID>, <Easing type>);
```

- `Picture ID`  : Picture's ID you want to add easing.
- `Easing type` : Easing type you want to apply to picture.

Example : Use Easing as BounceOut to Picture 1
```js
SetPictureEase(1, 'BounceOut');
```

If you want to reset easing to default easing type of picture, add below script event.

```
SetPictureEase(<Picture ID>);
```

- `Picture ID` : Picture's ID you want to reset easing type.

Example : Reset Easing to plugin's default type to Picture 1
```js
SetPictureEase(1);
```


You can use shake effect to picture with this.

```
ShakePicture(<Picture ID>, <Destination amount>, <Duration>);
```

- `Picture ID` : Picture's ID you want to take shake effect.
- `Destination amount` : Shake amount you want to finish duration.
- `Duration` : Duration (frames) of shake effect will take to finish.
> * Destination amount will applied by easing type.  
> * This doesn't wait event.  
     If you want to wait until finish this effect, add delay event after this script event.

Example : Apply shake intensity of 10 to Picture 1 over 60 frames
```js
ShakePicture(1, 10, 60);
```


Available ease list :

- Linear (Default easing of RPG Maker system)
- [QuadIn](https://easings.net/#easeInQuad)
- [QuadOut](https://easings.net/#easeOutQuad)
- [QuadInOut](https://easings.net/#easeInOutQuad)
- [CubicIn](https://easings.net/#easeInCubic)
- [CubicOut](https://easings.net/#easeOutCubic)
- [CubicInOut](https://easings.net/#easeInOutCubic)
- [QuartIn](https://easings.net/#easeInQuart)
- [QuartOut](https://easings.net/#easeOutQuart)
- [QuartInOut](https://easings.net/#easeInOutQuart)
- [QuintIn](https://easings.net/#easeInQuint)
- [QuintOut](https://easings.net/#easeOutQuint)
- [QuintInOut](https://easings.net/#easeInOutQuint)
- [SineIn](https://easings.net/#easeInSine)
- [SineOut](https://easings.net/#easeOutSine)
- [SineInOut](https://easings.net/#easeInOutSine)
- [BackIn](https://easings.net/#easeInBack)
- [BackOut](https://easings.net/#easeOutBack)
- [BackInOut](https://easings.net/#easeInOutBack)
- [CircIn](https://easings.net/#easeInCirc)
- [CircOut](https://easings.net/#easeOutCirc)
- [CircInOut](https://easings.net/#easeInOutCirc)
- [BounceIn](https://easings.net/#easeInBounce)
- [BounceOut](https://easings.net/#easeOutBounce)
- [BounceInOut](https://easings.net/#easeInOutBounce)
- [ElasticIn](https://easings.net/#easeInElastic)
- [ElasticOut](https://easings.net/#easeOutElastic)
- [ElasticInOut](https://easings.net/#easeInOutElastic)