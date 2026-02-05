import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import { Download, Copy, Check } from 'lucide-react';

const AffiliateMarketing = () => {
  const [assets, setAssets] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await affiliateAPI.getMarketingAssets();
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!assets) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          Marketing Assets
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Download banners and promotional materials</p>
      </div>

      {/* Banners */}
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
          Banner Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.banners && assets.banners.map((banner, index) => (
            <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-850">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">{banner.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">{banner.size}</span>
              </div>

              <a
                href={banner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Text */}
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-6">
          Promotional Copy
        </h2>
        <div className="space-y-4">
          {assets.promotional_text && assets.promotional_text.map((promo, index) => (
            <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">{promo.title}</h3>
                <button
                  onClick={() => copyToClipboard(promo.text, `promo-${index}`)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 font-medium"
                >
                  {copiedIndex === `promo-${index}` ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{promo.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Templates */}
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
          Social Media Templates
        </h2>
        <div className="space-y-4">
          {assets.social_templates && Object.entries(assets.social_templates).map(([platform, text], index) => (
            <div key={index} className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white capitalize">{platform}</h3>
                <button
                  onClick={() => copyToClipboard(text, `social-${index}`)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 font-medium"
                >
                  {copiedIndex === `social-${index}` ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AffiliateMarketing;
