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

const SEGMENT_COLORS = [0xd6003c, 0xf2c531, 0xa40b31, 0xf4c83d, 0xd6003c, 0xf2c531]

type Props = {
  resetSignal?: number
  onResult: (result: PhaserSpinResult) => void
  onError: (message: string) => void
}

export function PhaserSpinGame({ resetSignal = 0, onResult, onError }: Props) {
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
          this.drawBackground()
          this.drawHeader()
          this.createWheel()
          this.createSpinButton()
          this.drawFooter()
          sceneRef.current = this
        }

        drawBackground() {
          const { width, height } = this.scale

          const bg = this.add.graphics()
          bg.fillGradientStyle(0x7f0a23, 0x7f0a23, 0x4b0617, 0x4b0617, 1)
          bg.fillRect(0, 0, width, height)

          const scene = this.add.graphics()
          scene.fillGradientStyle(0x2f82cf, 0x79c5e8, 0x8c603b, 0x5a2c1d, 1)
          scene.fillRoundedRect(18, 145, width - 36, 380, 26)

          const mountains = this.add.graphics()
          mountains.fillStyle(0x456979, 1)
          mountains.fillTriangle(18, 505, width * 0.28, 250, width * 0.54, 505)
          mountains.fillStyle(0x5a7781, 1)
          mountains.fillTriangle(width * 0.2, 505, width * 0.58, 215, width - 18, 505)
          mountains.fillStyle(0x365666, 1)
          mountains.fillTriangle(width * 0.58, 505, width * 0.78, 290, width - 18, 505)
          mountains.fillStyle(0xf3efe2, 0.9)
          mountains.fillTriangle(width * 0.49, 292, width * 0.58, 215, width * 0.66, 292)

          const garlands = this.add.graphics()
          for (const x of [32, width - 32]) {
            garlands.lineStyle(2, 0x315b25, 1)
            garlands.lineBetween(x, 170, x, 500)

            for (let y = 182; y < 500; y += 42) {
              garlands.fillStyle(0xf29a1b, 1)
              garlands.fillCircle(x, y, 9)
              garlands.fillStyle(0xffc12e, 1)
              garlands.fillCircle(x - 5, y - 4, 5)
              garlands.fillCircle(x + 5, y - 4, 5)
              garlands.fillStyle(0x315b25, 1)
              garlands.fillTriangle(x, y + 14, x - 6, y + 3, x + 6, y + 3)
            }
          }

          const diyas = this.add.graphics()
          for (const x of [50, width - 50]) {
            const y = height - 120
            diyas.fillStyle(0xd88418, 1)
            diyas.fillEllipse(x, y + 12, 54, 22)
            diyas.fillStyle(0xffc44e, 1)
            diyas.fillTriangle(x, y - 8, x - 7, y + 10, x + 7, y + 10)
            diyas.fillStyle(0xfff0a5, 0.9)
            diyas.fillTriangle(x, y - 23, x - 4, y - 4, x + 4, y - 4)
          }

          this.drawKite(width * 0.22, 205, 0xe83a3a, 0.8)
          this.drawKite(width * 0.79, 225, 0x3c7edb, 0.7)
        }

        drawKite(x: number, y: number, color: number, scale: number) {
          const kite = this.add.graphics()
          kite.fillStyle(color, 1)
          kite.fillTriangle(x, y - 20 * scale, x + 18 * scale, y, x, y + 20 * scale)
          kite.fillStyle(0xffe06a, 1)
          kite.fillTriangle(x, y - 20 * scale, x, y + 20 * scale, x - 18 * scale, y)
          kite.lineStyle(1, 0x7a3c2a, 1)
          kite.lineBetween(x, y + 20 * scale, x + 10 * scale, y + 55 * scale)
        }

        drawHeader() {
          const { width } = this.scale

          const title = this.add.text(width / 2, 28, "दशैं–तिहार अफर गेम", {
            fontFamily: "Arial, sans-serif",
            fontSize: "28px",
            fontStyle: "bold",
            color: "#ffd85f",
            stroke: "#7c2600",
            strokeThickness: 7,
            shadow: { color: "#2c050c", blur: 8, offsetX: 0, offsetY: 4, fill: true },
          }).setOrigin(0.5)

          this.add.text(width / 2, 70, "20D CINEMA  •  SPIN & WIN", {
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            fontStyle: "bold",
            color: "#fff4d0",
            backgroundColor: "#8c1730",
            padding: { left: 14, right: 14, top: 8, bottom: 8 },
          }).setOrigin(0.5)

          this.add.text(width / 2, 113, "गेम खेल्नुहोस्, उपहार जित्नुहोस्", {
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            color: "#ffeaa4",
          }).setOrigin(0.5)

          this.tweens.add({
            targets: title,
            scale: 1.035,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: "Sine.inOut",
          })
        }

        createWheel() {
          const { width } = this.scale
          const cx = width / 2
          const cy = 355
          const radius = 146
          const slice = Phaser.Math.DegToRad(60)
          const start = Phaser.Math.DegToRad(-120)

          this.wheel = this.add.container(cx, cy)

          const glow = this.add.graphics()
          glow.fillStyle(0xffcf45, 0.12)
          glow.fillCircle(0, 0, radius + 28)
          this.wheel.add(glow)

          const outer = this.add.graphics()
          outer.fillStyle(0x7a0b24, 1)
          outer.fillCircle(0, 0, radius + 18)
          outer.lineStyle(6, 0xf0c95a, 1)
          outer.strokeCircle(0, 0, radius + 16)
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

            segments.lineStyle(2, 0xffec9a, 0.8)
            segments.beginPath()
            segments.moveTo(0, 0)
            segments.arc(0, 0, radius, a0, a1)
            segments.closePath()
            segments.strokePath()

            const mid = Phaser.Math.DegToRad(-90 + index * 60)
            const label = this.add.text(Math.cos(mid) * 92, Math.sin(mid) * 92, `${prize.top}\n${prize.bottom}`, {
              fontFamily: "Arial, sans-serif",
              fontSize: index > 1 && index < 4 ? "10px" : "12px",
              fontStyle: "bold",
              color: "#fff7dc",
              align: "center",
              stroke: "#4c0a16",
              strokeThickness: 3,
            }).setOrigin(0.5)
            label.setRotation(mid + Math.PI / 2)
            this.wheel.add(label)
          })

          for (let i = 0; i < 12; i++) {
            const angle = Phaser.Math.DegToRad(i * 30 - 15)
            const bulb = this.add.circle(Math.cos(angle) * (radius + 8), Math.sin(angle) * (radius + 8), 5, 0xffdf72)
            bulb.setStrokeStyle(1, 0xfff4b0, 1)
            this.wheel.add(bulb)

            this.tweens.add({
              targets: bulb,
              alpha: { from: 0.45, to: 1 },
              scale: { from: 0.85, to: 1.2 },
              duration: 650,
              delay: i * 55,
              yoyo: true,
              repeat: -1,
            })
          }

          const hub = this.add.graphics()
          hub.fillStyle(0x9c1835, 1)
          hub.fillCircle(0, 0, 39)
          hub.lineStyle(3, 0xf5d06b, 1)
          hub.strokeCircle(0, 0, 39)
          hub.fillStyle(0xf5d06b, 1)
          hub.fillCircle(0, 0, 5)
          this.wheel.add(hub)

          const pointer = this.add.graphics()
          pointer.fillStyle(0xffef9f, 1)
          pointer.fillTriangle(cx, cy - radius - 43, cx - 15, cy - radius - 13, cx + 15, cy - radius - 13)
          pointer.lineStyle(2, 0xa86c13, 1)
          pointer.strokeTriangle(cx, cy - radius - 43, cx - 15, cy - radius - 13, cx + 15, cy - radius - 13)
        }

        createSpinButton() {
          const { width, height } = this.scale
          this.spinButton = this.add.container(width / 2, height - 72)

          const plate = this.add.graphics()
          plate.fillStyle(0x8a102a, 1)
          plate.fillRoundedRect(-165, -29, 330, 58, 18)
          plate.lineStyle(2, 0xf1c85b, 1)
          plate.strokeRoundedRect(-165, -29, 330, 58, 18)
          this.spinButton.add(plate)

          const button = this.add.graphics()
          button.fillStyle(0xffc62d, 1)
          button.fillRoundedRect(-105, -20, 210, 40, 20)
          button.lineStyle(2, 0xfff1a3, 1)
          button.strokeRoundedRect(-105, -20, 210, 40, 20)
          this.spinButton.add(button)

          const text = this.add.text(0, 0, "SPIN & WIN", {
            fontFamily: "Arial, sans-serif",
            fontSize: "20px",
            fontStyle: "bold",
            color: "#6b1021",
          }).setOrigin(0.5)
          this.spinButton.add(text)

          this.spinButton.setSize(330, 58)
          this.spinButton.setInteractive(
            new Phaser.Geom.Rectangle(-165, -29, 330, 58),
            Phaser.Geom.Rectangle.Contains
          )

          this.spinButton.on("pointerdown", () => this.handleSpin(text, button))
        }

        drawFooter() {
          const { width, height } = this.scale
          this.add.text(width / 2, height - 25, "One spin per phone number  •  20D Cinema · Kathmandu", {
            fontFamily: "Arial, sans-serif",
            fontSize: "9px",
            color: "#ffe9a2",
          }).setOrigin(0.5)
        }

        async handleSpin(text: any, button: any) {
          if (this.spinning) return

          this.spinning = true
          text.setText("PREPARING...")
          button.setAlpha(0.7)

          try {
            const result = await requestSpin()
            const index = PRIZES.findIndex((prize) => prize.key === result.prize_key)

            if (index < 0) throw new Error("Prize result could not be read.")

            this.showCountdown(() => this.spinTo(index, result, text, button))
          } catch (error) {
            this.spinning = false
            button.setAlpha(1)
            text.setText("SPIN & WIN")
            onError(error instanceof Error ? error.message : "We couldn't start your spin.")
          }
        }

        showCountdown(onComplete: () => void) {
          const { width, height } = this.scale
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
                  this.time.delayedCall(180, () => {
                    count.destroy()
                    onComplete()
                  })
                  return
                }

                this.time.delayedCall(420, () => {
                  step += 1
                  next()
                })
              },
            })
          }

          next()
        }

        spinTo(index: number, result: PhaserSpinResult, text: any, button: any) {
          text.setText("SPINNING...")

          const current = Phaser.Math.RadToDeg(this.wheel.rotation)
          const targetModulo = -index * 60
          const delta = Phaser.Math.Wrap(targetModulo - current, -180, 180)
          const target = Phaser.Math.DegToRad(current + 360 * 8 + delta)

          this.lastTick = Math.floor(current / 60)

          this.tweens.add({
            targets: this.wheel,
            rotation: target,
            duration: 5800,
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
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
            if (!this.audioContext) this.audioContext = new AudioCtx()

            const ctx = this.audioContext
            void ctx.resume()

            const oscillator = ctx.createOscillator()
            const gain = ctx.createGain()

            oscillator.type = "triangle"
            oscillator.frequency.value = 640
            gain.gain.setValueAtTime(0.0001, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.005)
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045)

            oscillator.connect(gain)
            gain.connect(ctx.destination)
            oscillator.start()
            oscillator.stop(ctx.currentTime + 0.05)
          } catch {}
        }

        winBurst() {
          const { width } = this.scale
          this.cameras.main.flash(260, 255, 214, 88)
          this.cameras.main.shake(220, 0.006)

          for (let i = 0; i < 36; i++) {
            const piece = this.add.rectangle(
              width / 2,
              340,
              6,
              11,
              [0xffd85f, 0xd6003c, 0x668f35][i % 3]
            )

            this.tweens.add({
              targets: piece,
              x: width / 2 + (i % 2 ? 1 : -1) * (80 + (i * 23) % 180),
              y: 240 + ((i * 41) % 400),
              angle: 180 + i * 35,
              alpha: { from: 1, to: 0 },
              duration: 1100 + (i % 5) * 90,
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
