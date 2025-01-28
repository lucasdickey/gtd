'use client'

import { FC, useState } from 'react'
import './styles.css'

const Page: FC = () => {
  const [showToc, setShowToc] = useState(false)

  return (
    <div className="flex relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setShowToc(!showToc)}
        className="fixed top-4 right-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
      >
        {showToc ? '✕' : '☰'}
      </button>

      {/* Main content - adjusted margins for both mobile and desktop */}
      <div className="flex-1 w-full px-4 md:max-w-3xl md:ml-8 md:mr-80 py-8">
        <article className="prose prose-lg dark:prose-invert">
          <h1 id="title" className="text-4xl font-bold mb-8 pb-2 border-b">
            <a
              href="https://huggingface.co/deepseek-ai/DeepSeek-R1"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              DEEPSEEK R1
            </a>{' '}
            IMPACT ANALYSIS - COMPLETE REPORT
          </h1>

          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-8">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Note: This synthesis pulls from 12 episodes from 8 podcasts in
              <a
                href="https://deepcast.fm/podcast-list/deepseek-hype"
                target="_blank"
                rel="noopener noreferrer"
              >
                this &quot;DeepSeek Hype&quot; list
              </a>{' '}
              on{' '}
              <a
                href="https://deepcast.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                DeepCast.fm
              </a>
              . The goal was to review roughly the last 24 hour&apos;s DeepSeek
              coverage in podcasts. This is a one-off static output, but I might
              play with more. It&apos;s not hosted on DeepCast right now, as
              we&apos;re shortly going to launch a blog and we&apos;ll start
              putting content like this there.
            </p>
          </div>

          <h2
            id="executive-summary"
            className="text-3xl font-bold mt-10 mb-6 pb-2 border-b"
          >
            EXECUTIVE SUMMARY
          </h2>

          <h3 id="key-takeaways" className="text-2xl font-bold mt-8 mb-4">
            KEY TAKEAWAYS:
          </h3>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li className="text-gray-600 dark:text-gray-300">
              <a
                href="https://www.deepseek.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                DeepSeek
              </a>
              &apos;s claimed $6M training cost vs. hundreds of millions for
              Western competitors
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Pricing at ~3% of{' '}
              <a
                href="https://openai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                OpenAI
              </a>
              &apos;s rates triggered 16%{' '}
              <a
                href="https://www.nvidia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                NVDA
              </a>{' '}
              selloff
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                MIT license
              </a>{' '}
              release enables local running on consumer hardware
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Achieves performance parity with{' '}
              <a
                href="https://openai.com/gpt-4"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                OpenAI&apos;s GPT-4
              </a>
              /
              <a
                href="https://www.anthropic.com/claude"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Claude
              </a>
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Suggests US chip export controls may be less effective than
              intended
            </li>
          </ul>

          <h3 id="market-implications" className="text-2xl font-bold mt-8 mb-4">
            IMMEDIATE MARKET IMPLICATIONS:
          </h3>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li className="text-gray-600 dark:text-gray-300">
              AI infrastructure stocks experiencing significant volatility
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              API pricing pressure across industry
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Edge computing companies (
              <a
                href="https://www.apple.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                AAPL
              </a>
              ) positioned to benefit
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Application-focused companies (
              <a
                href="https://www.microsoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                MSFT
              </a>
              ,{' '}
              <a
                href="https://about.meta.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                META
              </a>
              ) may outperform pure infrastructure plays
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Total addressable market could expand due to lower costs (
              <a
                href="https://en.wikipedia.org/wiki/Jevons_paradox"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Jevon&apos;s Paradox
              </a>
              )
            </li>
          </ul>

          <h3 id="strategic-shifts" className="text-2xl font-bold mt-8 mb-4">
            STRATEGIC SHIFTS:
          </h3>
          <ul className="list-disc pl-6 my-4 space-y-2">
            <li className="text-gray-600 dark:text-gray-300">
              Value moving from model development to applications
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Inference optimization becoming critical differentiator
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              US strategic advantage in AI potentially eroding
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Open source momentum accelerating
            </li>
            <li className="text-gray-600 dark:text-gray-300">
              Industry likely to fragment into specialized providers
            </li>
          </ul>

          <h2
            id="detailed-analysis"
            className="text-3xl font-bold mt-10 mb-6 pb-2 border-b"
          >
            DETAILED ANALYSIS
          </h2>

          <div className="space-y-8">
            <section id="cost-disruption">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                1. COST DISRUPTION & MARKET EFFICIENCY
              </h3>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Immediate Market Impact
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                The fundamental economics of AI development are being challenged
                by DeepSeek&apos;s breakthrough. Their reported $6M training
                cost represents less than 1% of typical Western development
                costs, though some analysts dispute these figures. Scale
                AI&apos;s CEO suggests DeepSeek may have access to 50,000 H100
                chips despite export controls. Regardless of the exact figures,
                DeepSeek&apos;s ability to offer API access at 3% of
                OpenAI&apos;s rates is forcing rapid market adjustments.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Stock Market Response
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                This cost efficiency disruption has triggered significant market
                reactions, with Nvidia experiencing its largest single-day
                market cap loss in history. The broader implications suggest a
                potential commoditization of base AI capabilities, shifting
                value capture from model development to application deployment.
                Microsoft and Meta appear better positioned than pure
                infrastructure plays, though some argue lower costs could
                dramatically expand the total addressable market through
                Jevon&apos;s Paradox.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Key Open Questions
              </h4>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">
                  What is the true floor for AI training and inference costs?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  How will established players adapt their pricing strategies?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  Will commoditization of base AI capabilities create new value
                  capture opportunities?
                </li>
              </ul>
            </section>

            <section id="open-source">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                2. OPEN SOURCE VS. CLOSED SOURCE COMPETITION
              </h3>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Model Accessibility Impact
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                DeepSeek&apos;s MIT license release represents a pivotal moment
                in the open source AI movement. The model&apos;s ability to
                match or exceed proprietary solutions while running locally on
                consumer hardware challenges fundamental assumptions about
                necessary scale and investment. Early adopters report running
                significant workloads locally for pennies compared to hundreds
                of dollars through API services.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Technical Validation & Replication
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                The open source nature of R1 enables independent verification of
                DeepSeek&apos;s claims.{' '}
                <a
                  href="https://huggingface.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Hugging Face
                </a>{' '}
                and other organizations are already working to replicate the
                training process, which will provide crucial validation of the
                efficiency claims. The transparency of the approach has enabled
                rapid adoption and iteration by the developer community.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Key Open Questions
              </h4>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">
                  Can closed source models maintain any sustainable competitive
                  advantage?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  How will API-based business models evolve to remain viable?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  What new monetization strategies will emerge in an open-source
                  dominated landscape?
                </li>
              </ul>
            </section>

            <section id="technical-innovation">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                3. TECHNICAL INNOVATION & EFFICIENCY
              </h3>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Architectural Breakthroughs
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                DeepSeek&apos;s technical innovations focus on efficiency rather
                than raw scale. Key advances include 8-bit floating point
                numbers throughout training, compressed key-value indices,
                sophisticated &quot;mixture of experts&quot; architecture,
                multi-token prediction, and advanced load balancing. These
                improvements demonstrate that optimization can potentially
                replace raw compute power as the primary driver of performance.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Hardware Utilization
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                <a
                  href="https://scale.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Scale AI
                </a>
                &apos;s CEO suggests DeepSeek may have access to 50,000 H100
                chips despite export controls.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Key Open Questions
              </h4>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">
                  Will these efficiency gains translate to other model
                  architectures?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  How will hardware manufacturers adapt their roadmaps?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  Can these optimizations scale to more complex models?
                </li>
              </ul>
            </section>

            <section id="geopolitical">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                4. GEOPOLITICAL & REGULATORY IMPLICATIONS
              </h3>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Export Control Effectiveness
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                DeepSeek&apos;s emergence challenges the US strategy of
                maintaining AI leadership through export controls and
                infrastructure advantages. The ability to achieve
                state-of-the-art results with restricted hardware access
                suggests current policy approaches may need reassessment.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                International Competition
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                This development could accelerate international efforts to
                develop alternative AI hardware architectures and challenge
                US-centric AI supply chains. Countries may increasingly view
                Chinese open source AI as an attractive alternative to
                dependency on US technology.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Key Open Questions
              </h4>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">
                  How will US policy adapt to this new reality?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  Will this accelerate international AI collaboration or
                  competition?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  What new forms of strategic advantage will emerge?
                </li>
              </ul>
            </section>

            <section id="industry-structure">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                5. INDUSTRY STRUCTURE & COMPETITION
              </h3>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Market Fragmentation
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                The demonstrated ability to achieve competitive performance at
                dramatically lower cost points could reshape industry structure.
                This may enable more companies to compete at the frontier of AI
                development, leading to a more fragmented market with multiple
                specialized providers.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Investment Implications
              </h4>
              <p className="my-4 leading-7 text-gray-600 dark:text-gray-300">
                Companies like OpenAI and Anthropic, which have raised massive
                capital based on assumptions about necessary scale, may face
                increased scrutiny. The trend could accelerate movement toward
                specialized AI applications rather than general-purpose models.
              </p>

              <h4 className="text-xl font-bold mt-6 mb-3">
                Key Open Questions
              </h4>
              <ul className="list-disc pl-6 my-4 space-y-2">
                <li className="text-gray-600 dark:text-gray-300">
                  How will current market leaders adapt their strategies?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  What new business models will emerge?
                </li>
                <li className="text-gray-600 dark:text-gray-300">
                  Will specialization or consolidation dominate the next phase
                  of industry evolution?
                </li>
              </ul>
            </section>

            <section id="footnotes">
              <h3 className="text-2xl font-bold mt-8 mb-4">
                EPISODE REFERENCES
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <a
                    href="https://deepcast.fm/episode/deepseeks-ai-brings-tech-rout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [1] Bloomberg Technology Podcast - Discussion of
                    DeepSeek&apos;s claimed training costs
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/why-is-deepseek-so-popular"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [2] Daily Tech News Show - Market reaction coverage
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/thursdai-jan-23-2025-deepseek-r1-is-here-openai-operator-agent-500b-ai-manh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [3] ThursdAI - Benchmark comparisons between R1 and other
                    models
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/bonus-the-deepseek-reckoning-in-silicon-valley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [4] Big Technology Podcast - Satya Nadella&apos;s comments
                    on Jevon&apos;s Paradox
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/deepseeks-ai-brings-tech-rout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [5] Bloomberg Technology - Alexander Wang&apos;s comments on
                    DeepSeek&apos;s chip access
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/outlasting-noam-shazeer-crowdsourcing-chat-ai-with-14m-dau-and-becoming-the"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [6] Latent Space - Technical discussion of DeepSeek&apos;s
                    architecture
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/deepseeks-ai-brings-tech-rout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [7] Bloomberg Technology - Market impact coverage
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/emergency-pod-reinforcement-learning-works-reflecting-on-chinese-reasoning-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [8] Cognitive Revolution - Analysis of open source
                    implications
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/deepseek-rises-stargate-drama-openais-operator-debuts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [9] Big Technology Podcast - Geopolitical implications
                    discussion
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/thursdai-jan-23-2025-deepseek-r1-is-here-openai-operator-agent-500b-ai-manh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [10] ThursdAI - Technical breakdown of DeepSeek innovations
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/preview-72-hours-of-deepseek-hysteria-what-deepseek-means-for-big-tech-less"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [11] Sharp Tech with Ben Thompson - Ben Thompson&apos;s
                    analysis of hardware implications
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/yes-deepseek-is-actually-a-massive-deal-for-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [12] AI Daily Brief - Discussion of export control
                    implications
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/emergency-pod-reinforcement-learning-works-reflecting-on-chinese-reasoning-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [13] Cognitive Revolution - International response analysis
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/bonus-the-deepseek-reckoning-in-silicon-valley"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [14] Big Technology Podcast - Industry structure
                    implications
                  </a>
                </p>
                <p>
                  <a
                    href="https://deepcast.fm/episode/deepseeks-ai-brings-tech-rout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    [15] Bloomberg Technology - Impact on AI company valuations
                  </a>
                </p>
              </div>
            </section>
          </div>
        </article>
      </div>

      {/* Table of Contents */}
      <div
        className={`
        fixed top-0 right-0 w-full h-full md:w-72 md:h-auto md:top-8 md:right-8 
        bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-auto 
        transition-transform duration-200 ease-in-out z-40
        ${showToc ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        md:max-h-[calc(100vh-4rem)]
      `}
      >
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Table of Contents
        </h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="#executive-summary"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-bold"
            >
              Executive Summary
            </a>
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <a
                  href="#key-takeaways"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Key Takeaways
                </a>
              </li>
              <li>
                <a
                  href="#market-implications"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Market Implications
                </a>
              </li>
              <li>
                <a
                  href="#strategic-shifts"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Strategic Shifts
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="#detailed-analysis"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-bold"
            >
              Detailed Analysis
            </a>
            <ul className="ml-4 mt-2 space-y-2">
              <li>
                <a
                  href="#cost-disruption"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Cost Disruption & Market Efficiency
                </a>
              </li>
              <li>
                <a
                  href="#open-source"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Open Source vs. Closed Source
                </a>
              </li>
              <li>
                <a
                  href="#technical-innovation"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Technical Innovation & Efficiency
                </a>
              </li>
              <li>
                <a
                  href="#geopolitical"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Geopolitical & Regulatory Implications
                </a>
              </li>
              <li>
                <a
                  href="#industry-structure"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Industry Structure & Competition
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a
              href="#footnotes"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-bold"
            >
              Episode References
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Page
