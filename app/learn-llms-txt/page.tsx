import {
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Bot,
  Download,
} from "lucide-react";

export default function LlmsTxtPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Generate your file instantly",
    },
    {
      icon: CheckCircle,
      title: "100% Accurate",
      desc: "Every URL included, no errors",
    },
    {
      icon: Globe,
      title: "Standards Compliant",
      desc: "Follows community best practices",
    },
    {
      icon: Bot,
      title: "AI Optimized",
      desc: "Perfect format for LLM consumption",
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5'></div>
        <div className='relative max-w-4xl mx-auto px-6 pt-20 pb-16'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg'>
              <FileText className='w-8 h-8 text-white' />
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full border border-white/20'>
              <Sparkles className='w-4 h-4 text-yellow-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                AI-Ready Content Format
              </span>
            </div>
          </div>

          <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight'>
            What is an llms.txt File?
          </h1>

          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl'>
            Discover the simple text format that's revolutionizing how AI tools
            consume website content. Learn why{" "}
            <span className='font-semibold text-blue-600 dark:text-blue-400'>
              llms.txt
            </span>{" "}
            matters and how to generate one effortlessly.
          </p>

          <div className='flex flex-wrap gap-4 mb-12'>
            <button className='group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2'>
              Generate Your llms.txt Now
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </button>
            <button className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300'>
              Learn More Below
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className='max-w-6xl mx-auto px-6 py-16'>
        <div className='grid md:grid-cols-4 gap-6 mb-16'>
          {features.map((feature, index) => (
            <div>
              <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300'>
                <feature.icon className='w-6 h-6 text-white' />
              </div>
              <h3 className='font-bold text-gray-900 dark:text-white mb-2'>
                {feature.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-6 pb-20'>
        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12'>
          {/* What is llms.txt */}
          <section className='mb-12'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full'></div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                What Exactly is an llms.txt File?
              </h2>
            </div>
            <div className='prose prose-lg prose-gray dark:prose-invert max-w-none'>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
                An{" "}
                <code className='bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm font-mono'>
                  llms.txt
                </code>{" "}
                file is a plain text document that lists URLs or content
                pointers from a website in a format optimized for Large Language
                Models (LLMs) to consume easily.
              </p>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                Think of it as a distilled version of your website's sitemap (
                <code className='bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-1 rounded text-sm font-mono'>
                  sitemap.xml
                </code>
                ), stripped of all the XML complexity and metadata, leaving just
                the essential information AI needs to work effectively.
              </p>
            </div>
          </section>

          {/* Why Important */}
          <section className='mb-12'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full'></div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Why is llms.txt Important?
              </h2>
            </div>
            <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6'>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                Modern AI applications—chatbots, search engines, content
                summarizers—rely on{" "}
                <strong className='text-blue-600 dark:text-blue-400'>
                  clean, digestible input
                </strong>{" "}
                to understand and process your website's content.
              </p>
            </div>
            <div className='space-y-4'>
              {[
                "While sitemap.xml is designed for web crawlers and search engines, its XML format is bulky and complicated for AI models.",
                "llms.txt provides a simple, text-based list of your site's URLs or content snippets, making it easy for AI to index and analyze.",
                "This streamlined format speeds up AI ingestion, reduces errors, and ensures your content is accurately represented in AI-driven tools.",
              ].map((point, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 p-4 bg-white/60 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50'
                >
                  <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                  <p className='text-gray-600 dark:text-gray-300'>{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How Created */}
          <section className='mb-12'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-2 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full'></div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                How is llms.txt Created?
              </h2>
            </div>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-6'>
              Traditionally, generating an{" "}
              <code className='bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm font-mono'>
                llms.txt
              </code>{" "}
              required manual extraction or custom scripting to convert the XML
              sitemap into a plain text list. This involved:
            </p>
            <div className='grid md:grid-cols-3 gap-4 mb-6'>
              {[
                { step: 1, text: "Parsing the sitemap.xml file" },
                { step: 2, text: "Extracting all relevant URLs" },
                { step: 3, text: "Writing them line by line into a .txt file" },
              ].map((item, index) => (
                <div
                  key={index}
                  className='text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600'
                >
                  <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm mx-auto mb-3'>
                    {item.step}
                  </div>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-xl'>
              <p className='text-gray-700 dark:text-gray-300'>
                <strong>The Problem:</strong> While straightforward in concept,
                this process can be tedious and error-prone—especially for large
                websites or non-technical users.
              </p>
            </div>
          </section>

          {/* Our Solution */}
          <section className='mb-12'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full'></div>
              <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                Introducing Our llms.txt Generator
              </h2>
            </div>
            <div className='bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center mb-8'>
              <Zap className='w-12 h-12 text-yellow-500 mx-auto mb-4' />
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Zero-Stress Tool That Does It All
              </h3>
              <div className='grid md:grid-cols-3 gap-6 text-left'>
                {[
                  { icon: FileText, text: "Just upload your sitemap.xml file" },
                  { icon: Zap, text: "Get results in seconds" },
                  { icon: Download, text: "100% free, no setup required" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl'
                  >
                    <item.icon className='w-6 h-6 text-blue-600' />
                    <span className='text-gray-700 dark:text-gray-300 font-medium'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className='text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white'>
            <h3 className='text-2xl font-bold mb-4'>
              Ready to Generate Your llms.txt File?
            </h3>
            <p className='mb-6 opacity-90'>
              Join thousands of websites making their content AI-ready
            </p>
            <button className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto'>
              Generate Your llms.txt Now — It's Free
              <ArrowRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
