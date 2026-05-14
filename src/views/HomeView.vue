<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import HqivPipelineCanvas from '../components/HqivPipelineCanvas.vue'
import { renderDisplay } from '../lib/katexRender'

const step = ref(0)
const autoplay = ref(false)
const eqRef = ref<HTMLElement | null>(null)

const stepTitles = [
  'Shell ledger',
  'Shell increment',
  'Curvature density',
  'Cumulative channel',
  'Normalized Ω',
  'Phase readout 𝒭',
  'Phase lift Δ',
  'Imprint (α, γ)',
  'Field strength F',
  'O–Maxwell density',
  'Total action cell',
  'Friedmann + G_eff',
  'One morphism',
]

const equations: Record<number, string> = {
  0: String.raw`A(m)=4(m+2)(m+1),\qquad m\in\mathbb{N}`,
  1: String.raw`A(m+1)-A(m)=8(m+2)`,
  2: String.raw`\rho(x)=\frac{1}{x}\Bigl(1+\alpha\log x\Bigr),\quad x\ge 1,\quad \alpha=\tfrac{3}{5}`,
  3: String.raw`K(n)=\sum_{m=0}^{n-1}\rho(m+1),\qquad K(n)\ge H_n\to\infty`,
  4: String.raw`\Omega(n)=\frac{K(n)}{K(m_\star)},\qquad K(m_\star)>0`,
  5: String.raw`\mathcal{R}(\phi,t,n):=\mathcal{F}(\phi,t,\Omega(n))`,
  6: String.raw`\theta(n):=\mathcal{R}(\phi,t,n)-\mathcal{R}(\phi,t,m_\star),\quad U=\exp\!\bigl(\varepsilon\,\theta(n)\,\Delta\bigr)`,
  7: String.raw`\alpha+\gamma=1,\quad (\alpha,\gamma)=\Bigl(\tfrac{3}{5},\tfrac{2}{5}\Bigr),\quad \alpha_d=\frac{d}{2d-1}`,
  8: String.raw`F^{a}{}_{\mu\nu}(A):=A^{a}{}_{\nu}-A^{a}{}_{\mu}`,
  9: String.raw`\mathcal{L}_{\mathrm{kin}}(A)=-\frac{1}{4}\sum_{a,\mu,\nu}\frac{\bigl(F^{a}{}_{\mu\nu}\bigr)^2}{2}+\cdots`,
  10: String.raw`\mathcal{S}_{\mathrm{tot}}=\mathcal{S}_{O}[J](A,\phi)+\mathcal{S}_{\mathrm{grav}}(\phi,\rho_m,\rho_r)`,
  11: String.raw`\frac{13}{5}\,\phi^2=8\pi\,G_{\mathrm{eff}}(\phi)\,(\rho_m+\rho_r),\qquad G_{\mathrm{eff}}(\phi)=\phi^{\alpha},\ \ \alpha=\tfrac{3}{5}`,
  12: String.raw`\text{same }\alpha:\ \ \text{lattice imprint}\ \leftrightarrow\ \mathcal{L}_\phi\ \leftrightarrow\ G_{\mathrm{eff}}(\phi)=\phi^{3/5}`,
}

/** Canvas scene: pairs of derivation steps share one visual regime */
const scene = computed(() => Math.min(5, Math.floor(step.value / 2)))

async function paintEquation(s: number) {
  await nextTick()
  const el = eqRef.value
  const tex = equations[s]
  if (el && tex) renderDisplay(el, tex)
}

onMounted(() => {
  void paintEquation(step.value)
})

watch(step, (s) => {
  void paintEquation(s)
})

const progress = computed(() => `${step.value + 1} / ${stepTitles.length}`)

function prev() {
  step.value = Math.max(0, step.value - 1)
}

function next() {
  step.value = Math.min(stepTitles.length - 1, step.value + 1)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto flex max-w-3xl flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold tracking-wide text-emerald-400">HQIV — discrete light cone</p>
          <p class="text-xs text-slate-400">Growth → curvature → gauge → action → G_eff(φ)=φ^{3/5}</p>
        </div>
        <p class="text-xs text-slate-500">Aligned with HQIV-LEAN paper chain</p>
      </div>
    </header>

    <main class="mx-auto max-w-3xl space-y-10 px-4 py-10">
      <section class="space-y-3">
        <h1 class="text-3xl font-semibold text-white">One mathematical object</h1>
        <p class="text-slate-300">
          The formal pipeline chains null-shell combinatorics, a forced imprint pair (α,γ)=(3/5,2/5), the normalized phase
          readout into Δ on the (e₁,e₇) plane, and a variational O–Maxwell cell whose φ-coupling uses the same α that enters the
          Friedmann constraint through
          <span class="font-medium text-emerald-300">G_eff(φ)=φ^{3/5}</span>.
        </p>
      </section>

      <section class="rounded-xl border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-medium text-emerald-300">{{ stepTitles[step] }}</h2>
            <p class="text-xs text-slate-500">{{ progress }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
              <input v-model="autoplay" type="checkbox" class="rounded border-slate-600 bg-slate-800" />
              Animate canvas
            </label>
            <button
              type="button"
              class="rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-40"
              :disabled="step === 0"
              @click="prev"
            >
              Back
            </button>
            <button
              type="button"
              class="rounded border border-emerald-700 bg-emerald-900/40 px-3 py-1.5 text-sm text-emerald-100 hover:bg-emerald-900/60 disabled:opacity-40"
              :disabled="step === stepTitles.length - 1"
              @click="next"
            >
              Next
            </button>
          </div>
        </div>

        <HqivPipelineCanvas :scene="scene" :autoplay="autoplay" />

        <div
          class="mt-6 min-h-[5.5rem] overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/80 p-4 text-slate-100"
        >
          <div ref="eqRef" class="katex-display" />
        </div>
        <p class="mt-3 text-xs text-slate-500">
          Notation matches
          <code class="text-slate-400">closure.tex</code>,
          <code class="text-slate-400">hqiv_3d_causal_growth_octonionic_gauge.tex</code>, and
          <code class="text-slate-400">hqiv_octonionic_action_and_uniqueness.tex</code>.
        </p>
      </section>

      <section class="space-y-4 text-sm leading-relaxed text-slate-300">
        <h2 class="text-base font-medium text-white">Canvas ↔ derivation</h2>
        <ul class="list-inside list-disc space-y-2 text-slate-400">
          <li><span class="text-slate-200">Steps 0–1</span> — quadratic shell law from 3D null-lattice counting (vs cubic bulk scaling).</li>
          <li><span class="text-slate-200">Steps 2–5</span> — ρ → K → Ω and the phase-map axioms for 𝒭(φ,t,n) (closure.tex).</li>
          <li><span class="text-slate-200">Steps 6–7</span> — θ(n) lifts to Δ on span{e₁,e₇}; unit split pins α=3/5, γ=2/5.</li>
          <li><span class="text-slate-200">Steps 8–10</span> — discrete F from A, O–Maxwell density, total action cell (Action.lean).</li>
          <li>
            <span class="text-slate-200">Steps 11–12</span> — Friedmann with (3−γ_HQIV)=13/5 and
            <span class="font-medium text-emerald-300">G_eff(φ)=φ^{3/5}</span>; same φ slot in 𝒪_φ and GR (“lapse dragging”, GRFromMaxwell.lean).
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>
