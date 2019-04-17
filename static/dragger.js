/*
 * @Description: dragger
 * @Author: zy
 * @LastEditors: zy
 * @Date: 2019-04-04 16:35:59
 * @LastEditTime: 2019-04-16 19:12:29
 */
/**
 * @description: 拖拽类
 * @param {
 *  canRotate: true, 可旋转
 *  canZoom: true, 可缩放
 *  canPull: true, 可拉升
 *  canMove: true, 可平移
 *  showAngle: false, 展示角度
 *  showPosition: false, 展示位置
 *  isScale: true 是否等比例缩放
 * } 
 * @return:  
 */
let TARGET_OBJ = ''
export default class Drag {
  constructor (obj) {
    this.id = obj.id
    this.initParameter(obj)
  }
  initParameter (obj) {
    this.canRotate = obj.canRotate === undefined ? true : obj.canRotate
    this.canZoom = obj.canZoom === undefined ? true : obj.canZoom
    this.canPull = obj.canPull === undefined ? true : obj.canPull
    this.canMove = obj.canMove === undefined ? true : obj.canMove
    this.showBorder = obj.showBorder === undefined ? true : obj.showBorder
    this.showAngle = obj.showAngle
    this.showPosition = obj.showPosition
    this.isScale = obj.isScale === undefined ? true : obj.isScale
    this.parentNode = obj.parentNode ? document.getElementById(obj.parentNode) : document.body
    this.targetObj = document.getElementById(obj.id)
    this.initPannel()
    this.initPos()
    this.initEvent()
  }
  initPannel () {
    this.pannelDom = document.querySelector('#pannel')
    if (!this.pannelDom) {
      this.pannelDom = document.createElement('div')
      this.pannelDom.id = 'pannel'
      this.parentNode.appendChild(this.pannelDom)
    }
  }
  initEvent () {
    document.addEventListener('mousemove', e => {
      e.preventDefault && e.preventDefault()
      this.moveChange(e, TARGET_OBJ)
    })
    document.addEventListener('mouseup', e => {
      this.moveLeave(TARGET_OBJ)
    })
    if (this.canMove) {
      this.pannelDom.onmousedown = e => {
        e.stopPropagation()
        this.moveInit(9, e, TARGET_OBJ)
      }
      // this.pannelDom.addEventListener(e => {
      //   e.stopPropagation()
      //   this.moveInit(9, e, this.targetObj)
      // })
      this.targetObj.onmousedown = e => {
        this.moveInit(9, e, this.targetObj)
        this.initDom()
        // this.initPannelPos(this.targetObj)
      }
    }
  }
  /**
   * @description: 初始化dom
   * @param {} 
   * @return: null
   */
  initDom () {
    if (this.canRotate) {
      let rotatePoint = document.createElement('span')
      rotatePoint.className = `${this.id}-dragger-rotate-point dragger-rotate-point`
      if (this.showAngle) {
        this.angleDom = document.createElement('span')
        this.angleDom.className = `dragger-rotate-angle ${this.id}-dragger-rotate-angle`
        this.angleDom.style.display = 'none'
        this.pannelDom.appendChild(this.angleDom)
      }
      this.pannelDom.appendChild(rotatePoint)
      rotatePoint.addEventListener('mousedown', e => {
        e.stopPropagation()
        this.moveInit(0, e, TARGET_OBJ)
      })
    }
    if (this.showBorder) {
      for (let i = 1; i < 5; i++) {
        let baseLine = document.createElement('span')
        baseLine.className = `${this.id}-dragger-base-line dragger-base-line dragger-line${i}`
        this.pannelDom.appendChild(baseLine)
      }
    }
    if (this.canZoom) {
      for (let i = 1; i < 5; i++) {
        let zoomPoint = document.createElement('span')
        zoomPoint.className = `${this.id}-dragger-base-piont dragger-base-piont dragger-zoom${i}`
        this.pannelDom.appendChild(zoomPoint)
        zoomPoint.addEventListener('mousedown', e => {
          e.stopPropagation()
          this.moveInit(i, e, TARGET_OBJ)
        })
      }
    }
    if (this.canPull) {
      for (let i = 5; i < 9; i++) {
        let pullPoint = document.createElement('span')
        pullPoint.className = `${this.id}-dragger-base-piont dragger-base-piont dragger-pull${i}`
        this.pannelDom.appendChild(pullPoint)
        pullPoint.addEventListener('mousedown', e => {
          e.stopPropagation()
          this.moveInit(i, e, TARGET_OBJ)
        })
      }
    }
    if (this.canMove && this.showPosition) {
      this.positionDom = document.createElement('span')
      this.positionDom.className = 'dragger-position'
      this.pannelDom.appendChild(this.positionDom)
      this.positionDom.style.display = 'none'
    }
    
  }
  initPos () {
    this.left = this.targetObj.offsetLeft
    this.top = this.targetObj.offsetTop
    this.width = this.targetObj.offsetWidth
    this.height = this.targetObj.offsetHeight
    this.angle = this.getRotate(this.targetObj)
    // 记录初始盒子位置右下
    this.rightBottomPoint = {
      x: this.width + this.left,
      y: this.height + this.top
    }
    // 记录初始盒子右上角位置
    this.rightTopPoint = {
      x: this.width + this.left,
      y: this.top
    } 
    // 记录左上角的位置
    this.leftTopPoint = {
      x: this.left,
      y: this.top
    }
    // 左下
    this.leftBottomPoint = {
      x: this.left,
      y: this.top + this.height
    }
    // 左中
    this.leftMiddlePoint = {
      x: this.left,
      y: this.top  + this.height / 2
    }
    // 右中
    this.rightMiddlePoint = {
      x: this.left  + this.width,
      y: this.top  + this.height / 2
    }
    // 上中
    this.topMiddlePoint = {
      x: this.left  + this.width / 2,
      y: this.top
    }
    // 下中
    this.bottomMiddlePoint= {
      x: this.left  + this.width / 2,
      y: this.top  + this.height
    }
    // 记录中心位置
    this.centerPos = {
      x: this.left + this.width / 2,
      y: this.top + this.height / 2
    }
  }
  initPannelPos (target) {
    // this.pannelDom.style.left = `${target.offsetLeft}px`
    // this.pannelDom.style.top = `${target.offsetTop}px`
    // this.pannelDom.style.width = `${target.offsetWidth}px`
    // this.pannelDom.style.height = `${target.offsetHeight}px`
    // this.pannelDom.style.transform = `rotate(${this.getRotate(target)}deg)`
  }
  moveInit (type, e, target) {
    TARGET_OBJ = target
    this.type = Number(type)
    this.mouseInit = {
      x: e.clientX,
      y: e.clientY
    }
    this.scale = target.offsetWidth / target.offsetHeight
    this.initAngle = this.getRotate(target)
    this.pannelDom.style.left = `${target.offsetLeft}px`
    this.pannelDom.style.top = `${target.offsetTop}px`
    this.pannelDom.style.width = `${target.offsetWidth}px`
    this.pannelDom.style.height = `${target.offsetHeight}px`
    this.pannelDom.style.transform = `rotate(${this.initAngle}deg)`
    this.initRightBottomPoint = this.rightBottomPoint
    this.initRightTopPoint = this.rightTopPoint
    this.initLeftTopPoint = this.leftTopPoint
    this.initLeftBottomPoint = this.leftBottomPoint
    this.initLeftMiddlePoint = this.leftMiddlePoint
    this.initRightMiddlePoint = this.rightMiddlePoint
    this.initTopMiddlePoint = this.topMiddlePoint
    this.initBottomMiddlePoint = this.bottomMiddlePoint
    this.initCenterPos = this.centerPos
    this.initPosition = {
      x: target.offsetLeft,
      y: target.offsetTop
    }
    if (type === 0) {
      this.rotateFlag = true
      this.preRadian = Math.atan2(this.mouseInit.y - this.centerPos.y, this.mouseInit.x - this.centerPos.x)
    } else if (type < 10) {
      this.canChange = true
    }
  }
  moveChange (e, target) {
    let newHeight, newWidth, newRightBottomPoint, newLeftTopPoint, newLeftBottomPoint, newRightTopPoint, rotateCurrentPos
    switch (this.type) {
      case 0:
        if (this.rotateFlag) {
          this.rotateCurrent = {
            x: e.clientX,
            y: e.clientY
          }
          this.curRadian = Math.atan2(this.rotateCurrent.y - this.centerPos.y, this.rotateCurrent.x - this.centerPos.x)
          this.tranformRadian = this.curRadian - this.preRadian
          let newAngle = this.getRotate(target) +  Math.round(this.tranformRadian * 180 / Math.PI)
          target.style.transform = `rotate(${newAngle}deg)`
          this.pannelDom.style.transform = `rotate(${newAngle}deg)`
          if (this.showAngle) {
            this.angleDom.innerHTML = this.getRotate(target)
            this.angleDom.style.display = 'block'
          }
          this.preRadian = this.curRadian
          // 重新计算旋转后四个点的坐标变化
          let disAngle = newAngle - this.initAngle
          this.rightBottomPoint = this.getRotatedPoint(this.initRightBottomPoint, this.centerPos, disAngle)
          this.rightTopPoint = this.getRotatedPoint(this.initRightTopPoint, this.centerPos, disAngle)
          this.leftTopPoint = this.getRotatedPoint(this.initLeftTopPoint, this.centerPos, disAngle)
          this.leftBottomPoint = this.getRotatedPoint(this.initLeftBottomPoint, this.centerPos, disAngle)
          this.leftMiddlePoint = this.getRotatedPoint(this.initLeftMiddlePoint, this.centerPos, disAngle)
          this.rightMiddlePoint = this.getRotatedPoint(this.initRightMiddlePoint, this.centerPos, disAngle)
          this.topMiddlePoint = this.getRotatedPoint(this.initTopMiddlePoint, this.centerPos, disAngle)
          this.bottomMiddlePoint = this.getRotatedPoint(this.initBottomMiddlePoint, this.centerPos, disAngle)
        }
      case 1:
        if (this.canChange) {
          this.centerPos = {
            x: (e.clientX + this.rightBottomPoint.x) / 2,
            y: (e.clientY + this.rightMiddlePoint.y) / 2
          }
          // 计算旋转为水平角度的两点坐标
          newLeftTopPoint = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.centerPos, -this.initAngle)
          newRightBottomPoint = this.getRotatedPoint(this.rightBottomPoint, this.centerPos, -this.initAngle)
          newWidth = newRightBottomPoint.x - newLeftTopPoint.x
          newHeight = newRightBottomPoint.y - newLeftTopPoint.y
          if (this.isScale) {
            if (newWidth / newHeight > this.scale) {
              newLeftTopPoint.x = newLeftTopPoint.x + Math.abs(newWidth - newHeight * this.scale)
              newWidth = newHeight * this.scale
            } else {
              newLeftTopPoint.y = newLeftTopPoint.y + Math.abs(newHeight - newWidth / this.scale)
              newHeight = newWidth / this.scale
            }
            // 计算出左上角等比角度变换后水平坐标后，再计算旋转后的角度
            var rotateLeftTopPoint = this.getRotatedPoint(newLeftTopPoint, this.centerPos, this.initAngle)
            this.centerPos = {
              x: (rotateLeftTopPoint.x + this.rightBottomPoint.x) / 2,
              y: (rotateLeftTopPoint.y + this.rightBottomPoint.y) / 2
            }
            newLeftTopPoint = this.getRotatedPoint(rotateLeftTopPoint, this.centerPos, -this.initAngle)
            newRightBottomPoint = this.getRotatedPoint(this.rightBottomPoint, this.centerPos, -this.initAngle)
            newWidth = newRightBottomPoint.x - newLeftTopPoint.x
            newHeight = newRightBottomPoint.y - newLeftTopPoint.y
          }
          if (newWidth <= 12) {
            newWidth = 12
            newHeight = newWidth / this.scale
            newLeftTopPoint.x = newRightBottomPoint.x - newWidth
            newLeftTopPoint.y = newRightBottomPoint.y - newHeight
          }
          if (newHeight <= 12) {
            newHeight = 12
            newWidth = newHeight * this.scale
            newLeftTopPoint.y = newRightBottomPoint.y - newHeight
            newLeftTopPoint.x = newRightBottomPoint.x - newWidth
          }
          if (newHeight > 12 && newWidth > 12) {
            target.style.left = newLeftTopPoint.x + 'px'
            target.style.top = newLeftTopPoint.y + 'px'
            target.style.width = newWidth + 'px'
            target.style.height = newHeight + 'px'
            this.pannelDom.style.left = newLeftTopPoint.x + 'px'
            this.pannelDom.style.top = newLeftTopPoint.y + 'px'
            this.pannelDom.style.width = newWidth + 'px'
            this.pannelDom.style.height = newHeight + 'px'
          } 
        }
        break;
      case 2:
        if (this.canChange) {
          this.centerPos = {
            x: (e.clientX + this.rightTopPoint.x) / 2,
            y: (e.clientY + this.rightTopPoint.y) / 2
          }
          newLeftBottomPoint =  this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.centerPos, -this.initAngle)
          newRightTopPoint = this.getRotatedPoint(this.rightTopPoint, this.centerPos, -this.initAngle)
          newWidth = newRightTopPoint.x - newLeftBottomPoint.x
          newHeight = newLeftBottomPoint.y - newRightTopPoint.y
          if (this.isScale) {
            if (newWidth / newHeight > this.scale) {
              newLeftBottomPoint.x = newLeftBottomPoint.x + Math.abs(newWidth - newHeight * this.scale)
              newWidth = newHeight * this.scale
            } else {
              newLeftBottomPoint.y = newLeftBottomPoint.y - Math.abs(newHeight - newWidth / this.scale)
              newHeight = newWidth / this.scale
            }
            var rotatedLeftBottomPoint = this.getRotatedPoint(newLeftBottomPoint, this.centerPos, this.initAngle)
            this.centerPos = {
              x: (rotatedLeftBottomPoint.x + this.rightTopPoint.x) / 2,
              y: (rotatedLeftBottomPoint.y + this.rightTopPoint.y) / 2
            }
            newLeftBottomPoint = this.getRotatedPoint(rotatedLeftBottomPoint, this.centerPos, -this.initAngle)
            newRightTopPoint = this.getRotatedPoint(this.rightTopPoint, this.centerPos, -this.initAngle)
            newWidth = newRightTopPoint.x - newLeftBottomPoint.x
            newHeight = newLeftBottomPoint.y - newRightTopPoint.y
          }
          if (newHeight <= 12) {
            newHeight = 12
            newWidth = newHeight * this.scale
            newLeftBottomPoint = {
              x: newRightTopPoint.x - newWidth,
              y: newRightTopPoint.y + newHeight
            }
          }
          if (newWidth <= 12) {
            newWidth = 12
            newHeight = newWidth / this.scale
            newLeftBottomPoint = {
              x: newRightTopPoint.x - newWidth,
              y: newRightTopPoint.y + newHeight
            }
          }
          if (newHeight > 12 && newHeight > 12) {
            target.style.left = newLeftBottomPoint.x + 'px'
            target.style.top = newRightTopPoint.y + 'px'
            target.style.width = newWidth + 'px'
            target.style.height = newHeight + 'px'
            this.pannelDom.style.left = newLeftBottomPoint.x + 'px'
            this.pannelDom.style.top = newRightTopPoint.y + 'px'
            this.pannelDom.style.width = newWidth + 'px'
            this.pannelDom.style.height = newHeight + 'px'
          }
        }
        break;
      case 3:
        if (this.canChange) {
          this.centerPos = {
            x: (e.clientX + this.leftBottomPoint.x) / 2,
            y: (e.clientY + this.leftBottomPoint.y) / 2
          }
          newRightTopPoint = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.centerPos, -this.initAngle)
          newLeftBottomPoint = this.getRotatedPoint(this.leftBottomPoint, this.centerPos, -this.initAngle)
          newWidth = newRightTopPoint.x - newLeftBottomPoint.x
          newHeight = newLeftBottomPoint.y - newRightTopPoint.y
          if (this.isScale) {
            if (newWidth / newHeight > this.scale) {
              newRightTopPoint.x = newRightTopPoint.x - Math.abs(newWidth - newHeight * this.scale)
              newWidth = newHeight * this.scale
            } else {
              newRightTopPoint.y = newRightTopPoint.y + Math.abs(newHeight - newWidth / this.scale)
              newHeight = newWidth / this.scale
            }
            let rotatedRightTopPoint = this.getRotatedPoint(newRightTopPoint, this.centerPos, this.initAngle)
            this.centerPos = {
              x: (rotatedRightTopPoint.x + this.leftBottomPoint.x) / 2,
              y: (rotatedRightTopPoint.y + this.leftBottomPoint.y) / 2
            }
            newLeftBottomPoint = this.getRotatedPoint(this.leftBottomPoint, this.centerPos, -this.initAngle)
            newRightTopPoint = this.getRotatedPoint(rotatedRightTopPoint, this.centerPos, -this.initAngle)
            newWidth = newRightTopPoint.x - newLeftBottomPoint.x
            newHeight = newLeftBottomPoint.y - newRightTopPoint.y
          }
          if (newWidth <= 12) {
            newWidth = 12
            newHeight = newWidth / this.scale
            newRightTopPoint = {
              x: newLeftBottomPoint.x + newWidth,
              y: newLeftBottomPoint.y - newHeight
            }
          }
          if (newHeight <= 12) {
            newHeight = 12
            newWidth = newHeight * this.scale
            newRightTopPoint = {
              x: newLeftBottomPoint.x + newWidth,
              y: newLeftBottomPoint.y - newHeight
            }
          }
          if (newWidth > 12 && newHeight > 12) {
            target.style.left = newLeftBottomPoint.x + 'px'
            target.style.top = newRightTopPoint.y + 'px'
            target.style.width = newWidth + 'px'
            target.style.height = newHeight + 'px'
            this.pannelDom.style.left = newLeftBottomPoint.x + 'px'
            this.pannelDom.style.top = newRightTopPoint.y + 'px'
            this.pannelDom.style.width = newWidth + 'px'
            this.pannelDom.style.height = newHeight + 'px'
          }
        }
        break;
      case 4:
        if (this.canChange) {
          this.centerPos = {
            x: (e.clientX + this.leftTopPoint.x) / 2,
            y: (e.clientY + this.leftTopPoint.y) / 2
          }
          newRightBottomPoint = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.centerPos, -this.initAngle)
          newLeftTopPoint = this.getRotatedPoint(this.leftTopPoint, this.centerPos, -this.initAngle)
          newWidth = newRightBottomPoint.x - newLeftTopPoint.x
          newHeight = newRightBottomPoint.y - newLeftTopPoint.y
          if (this.isScale) {
            if (newWidth / newHeight > this.scale) {
              newRightBottomPoint.x = newRightBottomPoint.x - Math.abs(newWidth - newHeight * this.scale)
              newWidth = newHeight * this.scale
            } else {
              newRightBottomPoint.y = newRightBottomPoint.y - Math.abs(newHeight - newWidth / this.scale)
              newHeight = newWidth / this.scale
            }
            let rotatedRightBottomPoint = this.getRotatedPoint(newRightBottomPoint, this.centerPos, this.initAngle)
            this.centerPos = {
              x: (rotatedRightBottomPoint.x + this.leftTopPoint.x) / 2,
              y: (rotatedRightBottomPoint.y + this.leftTopPoint.y) / 2
            }
            newLeftTopPoint = this.getRotatedPoint(this.leftTopPoint, this.centerPos, -this.initAngle)
            newRightBottomPoint = this.getRotatedPoint(rotatedRightBottomPoint, this.centerPos, -this.initAngle)
            newWidth = newRightBottomPoint.x - newLeftTopPoint.x
            newHeight = newRightBottomPoint.y - newLeftTopPoint.y
          }
          if (newWidth <= 12) {
            newWidth = 12
            newHeight = newWidth / this.scale
            newRightBottomPoint = {
              x: newLeftTopPoint.x + newWidth,
              y: newLeftTopPoint.y + newHeight
            }
          }
          if (newHeight <= 12) {
            newHeight = 12
            newWidth = newHeight * this.scale
            newRightBottomPoint = {
              x: newLeftTopPoint.x + newWidth,
              y: newLeftTopPoint.y + newHeight
            }
          }
          if (newWidth > 12 && newHeight > 12) {
            target.style.left = newLeftTopPoint.x + 'px'
            target.style.top = newLeftTopPoint.y + 'px'
            target.style.width = newWidth + 'px'
            target.style.height = newHeight + 'px'
            this.pannelDom.style.left =  `${target.offsetLeft}px`
            this.pannelDom.style.top = `${target.offsetTop}px`
            this.pannelDom.style.width = `${target.offsetWidth}px`
            this.pannelDom.style.height = `${target.offsetHeight}px`
          }
        }
        break;
      case 5:
        if (this.canChange) {
          console.log(target)
          // 计算出鼠标现在所在的点，经过以bottommiddle点反向旋转后的位置,从而得到其y轴坐标点与topmiddle的x轴坐标结合，求出旋转后图形的topmiddle
          rotateCurrentPos = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.bottomMiddlePoint, -this.initAngle)
          let rotatedTopMiddlePoint = {
            x: this.bottomMiddlePoint.x,
            y: rotateCurrentPos.y
          }
          newHeight = this.bottomMiddlePoint.y - rotatedTopMiddlePoint.y

          // newHeight = Math.sqrt(Math.pow((this.topMiddlePoint.x - this.bottomMiddlePoint.x), 2) + Math.pow((this.topMiddlePoint.y - this.bottomMiddlePoint.y), 2))
          if (newHeight <= 12) {
            newHeight = 12
            rotatedTopMiddlePoint.y = this.bottomMiddlePoint.y - 12
          }
          // 计算转回去的topmiddle点坐标
          this.topMiddlePoint = this.getRotatedPoint(rotatedTopMiddlePoint, this.bottomMiddlePoint, this.initAngle)
          this.centerPos = {
            x: (this.topMiddlePoint.x + this.bottomMiddlePoint.x) / 2,
            y: (this.topMiddlePoint.y + this.bottomMiddlePoint.y) / 2
          }
          target.style.left = `${this.centerPos.x - target.offsetWidth / 2}px`
          target.style.height = newHeight + 'px'
          target.style.top = `${this.centerPos.y - newHeight / 2}px`
          this.pannelDom.style.left = `${this.centerPos.x - target.offsetWidth / 2}px`
          this.pannelDom.style.height = newHeight + 'px'
          this.pannelDom.style.top = `${this.centerPos.y - newHeight / 2}px`
        }
        break;
      case 6:
        if (this.canChange) {
          rotateCurrentPos = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.rightMiddlePoint, -this.initAngle)
          let rotatedLeftMiddlePonit = {
            x: rotateCurrentPos.x,
            y: this.rightMiddlePoint.y
          }
          newWidth = this.rightMiddlePoint.x - rotatedLeftMiddlePonit.x
          if (newWidth <= 12) {
            newWidth = 12
            rotatedLeftMiddlePonit.x = this.rightMiddlePoint.x - 12
          }
          this.leftMiddlePoint = this.getRotatedPoint(rotatedLeftMiddlePonit, this.rightMiddlePoint, this.initAngle)
          this.centerPos = {
            x: (this.leftMiddlePoint.x + this.rightMiddlePoint.x) / 2,
            y: (this.leftMiddlePoint.y + this.rightMiddlePoint.y) / 2
          }
          target.style.left = `${this.centerPos.x - newWidth / 2}px`
          target.style.top = `${this.centerPos.y - target.offsetHeight / 2}px`
          target.style.width = `${newWidth}px`
          this.pannelDom.style.left = `${this.centerPos.x - newWidth / 2}px`
          this.pannelDom.style.top = `${this.centerPos.y - target.offsetHeight / 2}px`
          this.pannelDom.style.width = `${newWidth}px`
        }
        break;
      case 7:
        if (this.canChange) {
          rotateCurrentPos = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.topMiddlePoint, -this.initAngle)
          let rotatedBottomMiddlePoint = {
            x: this.topMiddlePoint.x,
            y: rotateCurrentPos.y
          }
          newHeight = rotatedBottomMiddlePoint.y - this.topMiddlePoint.y
          if (newHeight <= 12) {
            newHeight = 12
            rotatedBottomMiddlePoint.y = this.topMiddlePoint.y - 12
          }
          this.bottomMiddlePoint = this.getRotatedPoint(rotatedBottomMiddlePoint, this.topMiddlePoint, this.initAngle)
          this.centerPos = {
            x: (this.bottomMiddlePoint.x + this.topMiddlePoint.x) / 2,
            y: (this.bottomMiddlePoint.y + this.topMiddlePoint.y) / 2
          }
          target.style.left = `${this.centerPos.x - target.offsetWidth / 2}px`
          target.style.top = `${this.centerPos.y - newHeight / 2}px`
          target.style.height = `${newHeight}px`
          this.pannelDom.style.left = `${this.centerPos.x - target.offsetWidth / 2}px`
          this.pannelDom.style.top = `${this.centerPos.y - newHeight / 2}px`
          this.pannelDom.style.height = `${newHeight}px`
        }
        break;
      case 8:
        if (this.canChange) {
          rotateCurrentPos = this.getRotatedPoint({
            x: e.clientX,
            y: e.clientY
          }, this.leftMiddlePoint, -this.initAngle)
          let rotatedRightMiddlePoint = {
            x: rotateCurrentPos.x,
            y: this.leftMiddlePoint.y
          }
          newWidth = rotatedRightMiddlePoint.x - this.leftMiddlePoint.x
          if (newWidth <= 12) {
            newWidth = 12
            rotatedRightMiddlePoint.x = this.leftMiddlePoint.x + 12
          }
          this.rightMiddlePoint = this.getRotatedPoint(rotatedRightMiddlePoint, this.leftMiddlePoint, this.initAngle)
          this.centerPos = {
            x: (this.leftMiddlePoint.x + this.rightMiddlePoint.x) / 2,
            y: (this.leftMiddlePoint.y + this.rightMiddlePoint.y) / 2
          }
          target.style.left = `${this.centerPos.x - newWidth / 2}px`
          target.style.top = `${this.centerPos.y - target.offsetHeight / 2}px`
          target.style.width = `${newWidth}px`
          this.pannelDom.style.left = `${this.centerPos.x - newWidth / 2}px`
          this.pannelDom.style.top = `${this.centerPos.y - target.offsetHeight / 2}px`
          this.pannelDom.style.width = `${newWidth}px`
        }
        break;
      case 9:
        if (this.canChange) {
          let dis = {
            x: e.clientX - this.mouseInit.x,
            y: e.clientY - this.mouseInit.y
          }
          let x = this.initPosition.x + dis.x
          let y = this.initPosition.y + dis.y
          target.style.left = `${x}px`
          target.style.top = `${y}px`
          this.pannelDom.style.left = `${x}px`
          this.pannelDom.style.top = `${y}px`
          this.pannelDom.style.width = `${target.offsetWidth}px`
          this.pannelDom.style.height = `${target.offsetHeight}px`
          this.centerPos = {
            x: this.initCenterPos.x + dis.x,
            y: this.initCenterPos.y + dis.y
          }
          if (this.showPosition) {
            this.positionDom.style.display = 'inline-block'
            this.positionDom.innerHTML = `X: ${x} Y: ${y}`
          }
        }
        break;
    }
  }
  moveLeave (target) {
    if (this.canChange || this.rotateFlag) {
      this.rotateFlag = false
      this.canChange = false
      if (this.angleDom) this.angleDom.style.display = 'none'
      if (this.positionDom) this.positionDom.style.display = 'none'
      this.getTransferPosition(target.offsetLeft, target.offsetTop, target.offsetWidth, target.offsetHeight, this.getRotate(target), this.centerPos)
    }
  }
  getRotate (target) {
    var st = window.getComputedStyle(target, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") || "FAIL";
      // With rotate(30deg)...
      // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
    if (tr !== 'none') {
      var values = tr.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var c = values[2];
      var d = values[3];
      var scale = Math.sqrt(a * a + b * b);
      // arc sin, convert from radians to degrees, round
      var sin = b / scale;
      // next line works for 30deg but not 130deg (returns 50);
      // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI))
      if (angle < 0) {
        angle = 360 + angle
      }
      return angle
    } else {
      return 0
    }
  }
  getRotatedPoint (curPos, centerPos, angle) {
    return {
      x: (curPos.x - centerPos.x) * Math.cos(Math.PI / 180 * angle) - (curPos.y - centerPos.y) * Math.sin(Math.PI / 180 * angle) + centerPos.x,
      y: (curPos.x - centerPos.x) * Math.sin(Math.PI / 180 * angle) + (curPos.y - centerPos.y) * Math.cos(Math.PI / 180 * angle) + centerPos.y                   
    }
  }
  getTransferPosition (left, top, width, height, angle, center) {
    // 计算变换后的方框四个角的位置
    var a1 = {
      x: left,
      y: top
    }
    var a2 = {
        x: left,
        y: top + height
    }
    var a3 = {
        x: left + width,
        y: top
    }
    var a4 = {
        x: left + width,
        y: top + height
    }
    var a5 = {
        x: left,
        y: top + height / 2
    }
    var a6 = {
        x: left + width,
        y: top + height / 2
    }
    var a7 = {
        x: left + width / 2,
        y: top
    }
    var a8 = {
        x: left + width / 2,
        y: top + height
    }
    this.leftTopPoint = this.getRotatedPoint(a1, center, angle)
    this.leftBottomPoint = this.getRotatedPoint(a2, center, angle)
    this.rightTopPoint = this.getRotatedPoint(a3, center, angle)
    this.rightBottomPoint = this.getRotatedPoint(a4, center, angle)
    this.leftMiddlePoint = this.getRotatedPoint(a5, center, angle)
    this.rightMiddlePoint = this.getRotatedPoint(a6, center, angle)
    this.topMiddlePoint = this.getRotatedPoint(a7, center, angle)
    this.bottomMiddlePoint = this.getRotatedPoint(a8, center, angle)
  }
}