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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing Assets</h1>
        <p className="text-gray-600 mt-1">Download banners and promotional materials</p>
      </div>

      {/* Banners */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Banner Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.banners && assets.banners.map((banner, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{banner.name}</span>
                <span className="text-sm text-gray-600">{banner.size}</span>
              </div>
              
              <a
                href={banner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Text */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Promotional Copy</h2>
        <div className="space-y-4">
          {assets.promotional_text && assets.promotional_text.map((promo, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{promo.title}</h3>
                <button
                  onClick={() => copyToClipboard(promo.text, `promo-${index}`)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
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
              <p className="text-sm text-gray-600">{promo.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Templates */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media Templates</h2>
        <div className="space-y-4">
          {assets.social_templates && Object.entries(assets.social_templates).map(([platform, text], index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 capitalize">{platform}</h3>
                <button
                  onClick={() => copyToClipboard(text, `social-${index}`)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
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
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AffiliateMarketing;
