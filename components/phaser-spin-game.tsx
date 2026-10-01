"use client"

import { useCallback, useEffect, useRef } from "react"

type PrizeKey =
  | "free_ticket"
  | "fifty_percent"
  | "rs_100_off"
  | "rs_50_off"
  | "twenty_percent"
  | "spin_again"

export type PhaserSpinResult = {
  ok: boolean
  code?: string
  message?: string
  prize_key: PrizeKey
  label?: string
  prize_code?: string
}

const PRIZES: Array<{ key: PrizeKey; top: string; bottom: string }> = [
  { key: "free_ticket", top: "FREE", bottom: "TICKET" },
  { key: "fifty_percent", top: "50%", bottom: "OFF" },
  { key: "rs_100_off", top: "Rs.100", bottom: "OFF" },
  { key: "rs_50_off", top: "Rs.50", bottom: "OFF" },
  { key: "twenty_percent", top: "20%", bottom: "OFF" },
  { key: "spin_again", top: "SPIN", bottom: "AGAIN" },
]

const SEGMENT_COLORS = [
  0xd7073d,
  0xf2c42e,
  0xb70b32,
  0xf0b52c,
  0xd7073d,
  0xf2c42e,
]

type Props = {
  resetSignal?: number
  onResult: (result: PhaserSpinResult) => void
  onError: (message: string) => void
}

export function PhaserSpinGame({
  resetSignal = 0,
  onResult,
  onError,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const gameRef = useRef<any>(null)

  const requestSpin = useCallback(async (): Promise<PhaserSpinResult> => {
    const saved = sessionStorage.getItem("20d-spin-participant")

    if (!saved) throw new Error("Please enter your details first.")

    let participant: { name?: string; phone?: string }

    try {
      participant = JSON.parse(saved)
    } catch {
      throw new Error("Please enter your details first.")
    }

    if (!participant.name || !participant.phone) {
      throw new Error("Please enter your details first.")
    }

    const response = await fetch("/api/spin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(participant),
    })

    const data = (await response.json()) as Partial<PhaserSpinResult>

    if (!response.ok || !data.ok || !data.prize_key) {
      throw new Error(data.message ?? "We couldn't start your spin.")
    }

    return data as PhaserSpinResult
  }, [])

  useEffect(() => {
    sceneRef.current?.resetSpin()
  }, [resetSignal])

  useEffect(() => {
    let disposed = false

    async function boot() {
      if (!mountRef.current) return

      const PhaserModule = await import("phaser")
      const Phaser = PhaserModule.default

      if (disposed || !mountRef.current) return

      class SpinScene extends Phaser.Scene {
        wheel!: any
        spinButton!: any
        spinning = false
        audioContext: AudioContext | null = null
        lastTick = -1

        constructor() {
          super({ key: "20DSpinScene" })
        }

        create() {
          this.drawBaseFrame()
          this.drawFestiveScene()
          this.drawHeader()
          this.createWheel()
          this.createSpinButton()
          this.drawFooter()
          sceneRef.current = this
        }

        drawBaseFrame() {
          const { width, height } = this.scale

          const background = this.add.graphics()
          background.fillGradientStyle(
            0x8d1028,
            0x6f0a20,
            0x420612,
            0x30040e,
            1,
          )
          background.fillRect(0, 0, width, height)

          const frame = this.add.graphics()
          frame.fillStyle(0x570718, 1)
          frame.fillRoundedRect(7, 7, width - 14, height - 14, 28)
          frame.lineStyle(3, 0xd9ad3c, 1)
          frame.strokeRoundedRect(7, 7, width - 14, height - 14, 28)
          frame.lineStyle(1, 0xffe59a, 0.5)
          frame.strokeRoundedRect(13, 13, width - 26, height - 26, 23)

          this.drawCornerOrnament(25, 25, 1)
          this.drawCornerOrnament(width - 25, 25, -1)
          this.drawCornerOrnament(25, height - 25, 1, -1)
          this.drawCornerOrnament(width - 25, height - 25, -1, -1)
        }

        drawCornerOrnament(
          x: number,
          y: number,
          sx: number,
          sy = 1,
        ) {
          const ornament = this.add.graphics()
          ornament.lineStyle(2, 0xe4bb4e, 0.8)
          ornament.beginPath()
          ornament.moveTo(x, y)
          ornament.quadraticBezierTo(
            x + sx * 22,
            y,
            x + sx * 25,
            y + sy * 12,
          )
          ornament.quadraticBezierTo(
            x + sx * 25,
            y + sy * 25,
            x + sx * 12,
            y + sy * 25,
          )
          ornament.strokePath()
          ornament.fillStyle(0xf3c74c, 0.85)
          ornament.fillCircle(x + sx * 6, y + sy * 6, 3)
        }

        drawFestiveScene() {
          const { width } = this.scale

          const scene = this.add.graphics()
          scene.fillGradientStyle(
            0x3d92d0,
            0x78c6e6,
            0xd9b36b,
            0x7d3f25,
            1,
          )
          scene.fillRoundedRect(20, 148, width - 40, 400, 24)

          const haze = this.add.graphics()
          haze.fillStyle(0xffffff, 0.14)
          haze.fillEllipse(width / 2, 245, width - 75, 110)
          haze.fillEllipse(width / 2, 430, width - 40, 100)

          const mountains = this.add.graphics()
          mountains.fillStyle(0x6a8790, 1)
          mountains.fillTriangle(
            20,
            520,
            width * 0.29,
            265,
            width * 0.56,
            520,
          )
          mountains.fillStyle(0x486b78, 1)
          mountains.fillTriangle(
            width * 0.18,
            520,
            width * 0.59,
            220,
            width - 20,
            520,
          )
          mountains.fillStyle(0x365b69, 1)
          mountains.fillTriangle(
            width * 0.54,
            520,
            width * 0.78,
            292,
            width - 20,
            520,
          )

          mountains.fillStyle(0xf5f0df, 0.95)
          mountains.fillTriangle(
            width * 0.51,
            290,
            width * 0.59,
            220,
            width * 0.67,
            290,
          )
          mountains.fillTriangle(
            width * 0.24,
            345,
            width * 0.29,
            265,
            width * 0.36,
            345,
          )

          const foreground = this.add.graphics()
          foreground.fillStyle(0x70401f, 0.65)
          foreground.fillRect(20, 482, width - 40, 66)

          this.drawGarland(38, 164, 518, 1)
          this.drawGarland(width - 38, 164, 518, -1)

          this.drawKite(width * 0.23, 213, 0xe83a3a, 0.8)
          this.drawKite(width * 0.78, 230, 0x3e79db, 0.7)

          this.drawDiya(56, 535, 1)
          this.drawDiya(width - 56, 535, -1)
        }

        drawGarland(x: number, top: number, bottom: number, side: number) {
          const garland = this.add.graphics()
          garland.lineStyle(2, 0x315b25, 1)
          garland.lineBetween(x, top, x, bottom)

          for (let y = top + 15; y < bottom; y += 44) {
            this.drawFlower(x, y, 0.72)
            garland.fillStyle(0x315b25, 1)
            garland.fillTriangle(
              x,
              y + 18,
              x + side * 7,
              y + 4,
              x + side * 6,
              y + 25,
            )
          }
        }

        drawFlower(x: number, y: number, scale: number) {
          const flower = this.add.graphics()
          const petal = 7 * scale

          flower.fillStyle(0xf08a19, 1)
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8
            flower.fillCircle(
              x + Math.cos(angle) * petal * 0.75,
              y + Math.sin(angle) * petal * 0.75,
              petal * 0.72,
            )
          }

          flower.fillStyle(0xffc83f, 1)
          flower.fillCircle(x, y, petal * 0.72)

          flower.fillStyle(0xf5e7a0, 0.8)
          flower.fillCircle(x - petal * 0.2, y - petal * 0.25, petal * 0.2)
        }

        drawDiya(x: number, y: number, side: number) {
          const diya = this.add.graphics()
          diya.fillStyle(0xc87817, 1)
          diya.fillEllipse(x, y + 9, 54, 18)
          diya.lineStyle(2, 0xffd25b, 1)
          diya.strokeEllipse(x, y + 9, 54, 18)

          diya.fillStyle(0xffc93c, 1)
          diya.fillTriangle(x, y - 10, x - 8, y + 7, x + 8, y + 7)

          diya.fillStyle(0xfff4b0, 0.9)
          diya.fillTriangle(x, y - 28, x - 5, y - 6, x + 5, y - 6)

          this.tweens.add({
            targets: diya,
            scaleX: { from: 0.95, to: 1.05 },
            scaleY: { from: 0.96, to: 1.04 },
            duration: 700,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
          })

          diya.x += side * 0
        }

        drawKite(
          x: number,
          y: number,
          color: number,
          scale: number,
        ) {
          const kite = this.add.graphics()
          kite.fillStyle(color, 1)
          kite.fillTriangle(
            x,
            y - 22 * scale,
            x + 19 * scale,
            y,
            x,
            y + 22 * scale,
          )
          kite.fillStyle(0xffdf67, 1)
          kite.fillTriangle(
            x,
            y - 22 * scale,
            x,
            y + 22 * scale,
            x - 19 * scale,
            y,
          )
          kite.lineStyle(1, 0x693d2d, 1)
          kite.lineBetween(
            x,
            y + 22 * scale,
            x + 10 * scale,
            y + 62 * scale,
          )
        }

        drawHeader() {
          const { width } = this.scale

          this.add.text(width / 2, 25, "गेम खेल्नुहोस्, उपहार जित्नुहोस्", {
            fontFamily: "Arial, sans-serif",
            fontSize: "10px",
            fontStyle: "bold",
            color: "#ffe9a2",
          }).setOrigin(0.5)

          const ribbon = this.add.graphics()
          ribbon.fillStyle(0xc3163b, 1)
          ribbon.fillTriangle(
            55,
            57,
            25,
            47,
            25,
            82,
          )
          ribbon.fillTriangle(
            width - 55,
            57,
            width - 25,
            47,
            width - 25,
            82,
          )
          ribbon.fillStyle(0xffe6a0, 1)
          ribbon.fillRoundedRect(48, 45, width - 96, 55, 12)
          ribbon.lineStyle(2, 0xf2c74e, 1)
          ribbon.strokeRoundedRect(48, 45, width - 96, 55, 12)

          const title = this.add.text(
            width / 2,
            72,
            "दशैं–तिहार अफर गेम",
            {
              fontFamily: "Arial, sans-serif",
              fontSize: "24px",
              fontStyle: "bold",
              color: "#a20b2f",
              stroke: "#fff3c6",
              strokeThickness: 2,
            },
          ).setOrigin(0.5)

          this.add.text(width / 2, 117, "20D CINEMA  •  SPIN & WIN", {
            fontFamily: "Arial, sans-serif",
            fontSize: "10px",
            fontStyle: "bold",
            color: "#fff3c7",
            backgroundColor: "#7e0c26",
            padding: { left: 12, right: 12, top: 6, bottom: 6 },
          }).setOrigin(0.5)

          this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.025 },
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
          })
        }

        createWheel() {
          const { width } = this.scale
          const cx = width / 2
          const cy = 355
          const radius = 139
          const slice = Phaser.Math.DegToRad(60)
          const start = Phaser.Math.DegToRad(-120)

          this.wheel = this.add.container(cx, cy)

          const glow = this.add.graphics()
          glow.fillStyle(0xffd45a, 0.11)
          glow.fillCircle(0, 0, radius + 34)
          this.wheel.add(glow)

          const pedestal = this.add.graphics()
          pedestal.fillStyle(0x641020, 1)
          pedestal.fillRoundedRect(-166, 130, 332, 38, 15)
          pedestal.fillStyle(0x8e1730, 1)
          pedestal.fillRoundedRect(-135, 112, 270, 30, 12)
          pedestal.lineStyle(2, 0xf0c65b, 1)
          pedestal.strokeRoundedRect(-135, 112, 270, 30, 12)
          this.wheel.add(pedestal)

          const outer = this.add.graphics()
          outer.fillStyle(0x8e102a, 1)
          outer.fillCircle(0, 0, radius + 19)
          outer.lineStyle(7, 0xf0c95a, 1)
          outer.strokeCircle(0, 0, radius + 17)
          outer.lineStyle(2, 0xffeaa0, 0.7)
          outer.strokeCircle(0, 0, radius + 9)
          this.wheel.add(outer)

          const segments = this.add.graphics()

          PRIZES.forEach((prize, index) => {
            const a0 = start + index * slice
            const a1 = a0 + slice

            segments.fillStyle(SEGMENT_COLORS[index], 1)
            segments.beginPath()
            segments.moveTo(0, 0)
            segments.arc(0, 0, radius, a0, a1)
            segments.closePath()
            segments.fillPath()

            segments.lineStyle(2, 0xffe99b, 0.85)
            segments.beginPath()
            segments.moveTo(0, 0)
            segments.arc(0, 0, radius, a0, a1)
            segments.closePath()
            segments.strokePath()

            const mid = Phaser.Math.DegToRad(-90 + index * 60)

            const icon = this.add.circle(
              Math.cos(mid) * 91,
              Math.sin(mid) * 91 - 18,
              10,
              0xf8d15e,
            )
            icon.setStrokeStyle(2, 0x8f1730, 1)
            this.wheel.add(icon)

            const label = this.add.text(
              Math.cos(mid) * 91,
              Math.sin(mid) * 91 + 7,
              `${prize.top}\n${prize.bottom}`,
              {
                fontFamily: "Arial, sans-serif",
                fontSize: index > 1 && index < 4 ? "10px" : "11px",
                fontStyle: "bold",
                color: "#fff9e5",
                align: "center",
                stroke: "#5c0719",
                strokeThickness: 3,
                lineSpacing: 1,
              },
            ).setOrigin(0.5)

            this.wheel.add(label)
          })

          for (let i = 0; i < 18; i++) {
            const angle = Phaser.Math.DegToRad(i * 20)
            const bulb = this.add.circle(
              Math.cos(angle) * (radius + 8),
              Math.sin(angle) * (radius + 8),
              4.5,
              i % 2 ? 0xffd65a : 0xfff0a5,
            )
            bulb.setStrokeStyle(1, 0xfff5c5, 1)
            this.wheel.add(bulb)

            this.tweens.add({
              targets: bulb,
              alpha: { from: 0.35, to: 1 },
              scale: { from: 0.82, to: 1.18 },
              duration: 620,
              delay: i * 45,
              yoyo: true,
              repeat: -1,
            })
          }

          const inner = this.add.graphics()
          inner.lineStyle(2, 0xffe99b, 0.55)
          inner.strokeCircle(0, 0, 108)
          inner.strokeCircle(0, 0, 47)
          this.wheel.add(inner)

          const hub = this.add.graphics()
          hub.fillStyle(0x9b1634, 1)
          hub.fillCircle(0, 0, 40)
          hub.lineStyle(3, 0xf5d06b, 1)
          hub.strokeCircle(0, 0, 40)
          hub.fillStyle(0xf5d06b, 1)
          hub.fillCircle(0, 0, 5)
          this.wheel.add(hub)

          this.add.text(cx, cy + 1, "20D", {
            fontFamily: "Arial, sans-serif",
            fontSize: "13px",
            fontStyle: "bold",
            color: "#fff1b0",
          }).setOrigin(0.5)

          const pointer = this.add.graphics()
          pointer.fillStyle(0xffef9f, 1)
          pointer.fillTriangle(
            cx,
            cy - radius - 39,
            cx - 17,
            cy - radius - 10,
            cx + 17,
            cy - radius - 10,
          )
          pointer.lineStyle(2, 0x9d6515, 1)
          pointer.strokeTriangle(
            cx,
            cy - radius - 39,
            cx - 17,
            cy - radius - 10,
            cx + 17,
            cy - radius - 10,
          )

          const pointerGlow = this.add.circle(
            cx,
            cy - radius - 18,
            5,
            0xffe98a,
          )
          pointerGlow.setDepth(10)

          this.tweens.add({
            targets: pointerGlow,
            alpha: { from: 0.4, to: 1 },
            scale: { from: 0.8, to: 1.35 },
            duration: 700,
            yoyo: true,
            repeat: -1,
          })
        }

        createSpinButton() {
          const { width, height } = this.scale
          this.spinButton = this.add.container(width / 2, height - 76)

          const panel = this.add.graphics()
          panel.fillStyle(0x760d25, 1)
          panel.fillRoundedRect(-170, -44, 340, 88, 18)
          panel.lineStyle(2, 0xf0c95a, 1)
          panel.strokeRoundedRect(-170, -44, 340, 88, 18)
          panel.lineStyle(1, 0xffe8a0, 0.35)
          panel.strokeRoundedRect(-162, -37, 324, 74, 14)
          this.spinButton.add(panel)

          this.add.text(width / 2, height - 107, "READY TO WIN?", {
            fontFamily: "Arial, sans-serif",
            fontSize: "9px",
            fontStyle: "bold",
            color: "#ffeaa2",
            letterSpacing: 2,
          }).setOrigin(0.5)

          const button = this.add.graphics()
          button.fillGradientStyle(0xffe35a, 0xf4b51f, 0xe79213, 0xffca34, 1)
          button.fillRoundedRect(-110, -22, 220, 44, 22)
          button.lineStyle(2, 0xfff4ae, 1)
          button.strokeRoundedRect(-110, -22, 220, 44, 22)
          this.spinButton.add(button)

          const text = this.add.text(0, 0, "SPIN & WIN", {
            fontFamily: "Arial, sans-serif",
            fontSize: "19px",
            fontStyle: "bold",
            color: "#671020",
          }).setOrigin(0.5)
          this.spinButton.add(text)

          this.spinButton.setSize(340, 88)
          this.spinButton.setInteractive(
            new Phaser.Geom.Rectangle(-170, -44, 340, 88),
            Phaser.Geom.Rectangle.Contains,
          )

          this.spinButton.on("pointerover", () => {
            if (!this.spinning) this.tweens.add({
              targets: this.spinButton,
              scale: 1.025,
              duration: 130,
            })
          })

          this.spinButton.on("pointerout", () => {
            if (!this.spinning) this.tweens.add({
              targets: this.spinButton,
              scale: 1,
              duration: 130,
            })
          })

          this.spinButton.on("pointerdown", () => {
            this.tweens.add({
              targets: this.spinButton,
              scale: 0.975,
              duration: 80,
              yoyo: true,
            })
            this.handleSpin(text, button)
          })
        }

        drawFooter() {
          const { width, height } = this.scale

          this.add.text(
            width / 2,
            height - 20,
            "ONE SPIN PER PHONE NUMBER  •  20D CINEMA · KATHMANDU",
            {
              fontFamily: "Arial, sans-serif",
              fontSize: "7px",
              fontStyle: "bold",
              color: "#ffe9a2",
            },
          ).setOrigin(0.5)
        }

        async handleSpin(text: any, button: any) {
          if (this.spinning) return

          this.spinning = true
          text.setText("PREPARING...")
          button.setAlpha(0.72)

          try {
            const result = await requestSpin()
            const index = PRIZES.findIndex(
              (prize) => prize.key === result.prize_key,
            )

            if (index < 0) {
              throw new Error("Prize result could not be read.")
            }

            this.showCountdown(() =>
              this.spinTo(index, result, text, button),
            )
          } catch (error) {
            this.spinning = false
            button.setAlpha(1)
            text.setText("SPIN & WIN")
            onError(
              error instanceof Error
                ? error.message
                : "We couldn't start your spin.",
            )
          }
        }

        showCountdown(onComplete: () => void) {
          const { width, height } = this.scale

          const overlay = this.add.graphics()
          overlay.fillStyle(0x24030c, 0.25)
          overlay.fillRect(0, 0, width, height)
          overlay.setDepth(90)

          const count = this.add.text(width / 2, height / 2, "3", {
            fontFamily: "Arial, sans-serif",
            fontSize: "74px",
            fontStyle: "bold",
            color: "#fff2a6",
            stroke: "#7c2600",
            strokeThickness: 10,
          }).setOrigin(0.5).setDepth(100)

          const steps = ["3", "2", "1", "SPIN!"]
          let step = 0

          const next = () => {
            count.setText(steps[step])
            count.setScale(0.55)
            count.setAlpha(0.2)

            this.tweens.add({
              targets: count,
              scale: 1,
              alpha: 1,
              duration: 260,
              ease: "Back.Out",
              onComplete: () => {
                if (step === steps.length - 1) {
                  this.time.delayedCall(160, () => {
                    overlay.destroy()
                    count.destroy()
                    onComplete()
                  })
                  return
                }

                this.time.delayedCall(400, () => {
                  step += 1
                  next()
                })
              },
            })
          }

          next()
        }

        spinTo(
          index: number,
          result: PhaserSpinResult,
          text: any,
          button: any,
        ) {
          text.setText("SPINNING...")

          const current = Phaser.Math.RadToDeg(this.wheel.rotation)
          const targetModulo = -index * 60
          const delta = Phaser.Math.Wrap(
            targetModulo - current,
            -180,
            180,
          )
          const target = Phaser.Math.DegToRad(
            current + 360 * 8 + delta,
          )

          this.lastTick = Math.floor(current / 60)

          this.tweens.add({
            targets: this.wheel,
            rotation: target,
            duration: 6000,
            ease: "Cubic.easeOut",
            onUpdate: () => {
              const deg = Phaser.Math.RadToDeg(this.wheel.rotation)
              const sector = Math.floor(Math.abs(deg) / 60)

              if (sector !== this.lastTick) {
                this.lastTick = sector
                this.tickSound()
              }
            },
            onComplete: () => {
              this.spinning = false
              button.setAlpha(1)
              text.setText("SPIN & WIN")
              this.winBurst()
              onResult(result)
            },
          })
        }

        resetSpin() {
          this.spinning = false
        }

        tickSound() {
          try {
            const AudioCtx =
              window.AudioContext ||
              (window as any).webkitAudioContext

            if (!this.audioContext) {
              this.audioContext = new AudioCtx()
            }

            const ctx = this.audioContext
            void ctx.resume()

            const oscillator = ctx.createOscillator()
            const gain = ctx.createGain()

            oscillator.type = "triangle"
            oscillator.frequency.value = 640
            gain.gain.setValueAtTime(0.0001, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(
              0.07,
              ctx.currentTime + 0.005,
            )
            gain.gain.exponentialRampToValueAtTime(
              0.0001,
              ctx.currentTime + 0.045,
            )

            oscillator.connect(gain)
            gain.connect(ctx.destination)
            oscillator.start()
            oscillator.stop(ctx.currentTime + 0.05)
          } catch {}
        }

        winBurst() {
          const { width } = this.scale

          this.cameras.main.flash(300, 255, 214, 88)
          this.cameras.main.shake(240, 0.007)

          for (let i = 0; i < 48; i++) {
            const piece = this.add.rectangle(
              width / 2,
              345,
              5,
              10,
              [0xffd85f, 0xd6003c, 0x668f35, 0xffffff][i % 4],
            )

            this.tweens.add({
              targets: piece,
              x:
                width / 2 +
                (i % 2 ? 1 : -1) * (70 + ((i * 23) % 190)),
              y: 210 + ((i * 41) % 450),
              angle: 180 + i * 35,
              alpha: { from: 1, to: 0 },
              duration: 1050 + (i % 5) * 100,
              ease: "Cubic.easeOut",
              onComplete: () => piece.destroy(),
            })
          }
        }
      }

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: mountRef.current,
        width: 430,
        height: 820,
        backgroundColor: "#5e071a",
        antialias: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 430,
          height: 820,
        },
        render: {
          pixelArt: false,
          roundPixels: false,
        },
        scene: SpinScene,
      })
    }

    void boot()

    return () => {
      disposed = true
      sceneRef.current = null
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [requestSpin, onResult, onError])

  return (
    <div
      ref={mountRef}
      className="mx-auto aspect-[430/820] w-full max-w-[430px] overflow-hidden rounded-[28px] border border-[#f0c95a]/35 bg-[#5e071a] shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
    />
  )
}
