import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react';

const AffiliateReferralLinks = () => {
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchReferralLink();
  }, []);

  const fetchReferralLink = async () => {
    try {
      const response = await affiliateAPI.getReferralLink();
      setLinkData(response.data);
    } catch (error) {
      console.error('Error fetching referral link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Links</h1>
        <p className="text-gray-600 mt-1">Your unique tracking links and promotional materials</p>
      </div>

      {/* Main Referral Link */}
      <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Referral Code</h2>
            <div className="flex items-center space-x-3">
              <code className="bg-white px-6 py-3 rounded-lg text-2xl font-mono font-bold text-blue-600 border-2 border-blue-300">
                {linkData?.referral_code}
              </code>
              <button
                onClick={() => copyToClipboard(linkData?.referral_code, 'code')}
                className="p-3 bg-white rounded-lg hover:bg-gray-50 border border-gray-300"
              >
                {copied === 'code' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Referral URL</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={linkData?.referral_url || ''}
                readOnly
                className="flex-1 px-4 py-3 bg-white rounded-lg border border-gray-300 text-gray-700 font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(linkData?.referral_url, 'url')}
                className="btn-primary flex items-center space-x-2"
              >
                {copied === 'url' ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Link Variations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Short URL */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <ExternalLink className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Short URL</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Perfect for social media and messaging</p>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={linkData?.short_url || ''}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 text-gray-700 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(linkData?.short_url, 'short')}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {copied === 'short' ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <QrCode className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">For offline marketing and print materials</p>
          <button
            onClick={() => window.open(linkData?.qr_code_url, '_blank')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View QR Code</span>
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use Your Referral Links</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Share Your Link</h4>
              <p className="text-sm text-gray-600">
                Copy your referral URL and share it on social media, blogs, forums, or via email
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Track Performance</h4>
              <p className="text-sm text-gray-600">
                Monitor clicks, registrations, and conversions in real-time from your dashboard
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Earn Commissions</h4>
              <p className="text-sm text-gray-600">
                Receive ${linkData?.cpa_amount || 50} for every player who deposits through your link
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Links */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Banner Images</h2>
        <p className="text-sm text-gray-600 mb-4">Download pre-made banners with your tracking code</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {linkData?.banner_images?.map((banner, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                <img src={banner} alt={`Banner ${index + 1}`} className="max-w-full max-h-full" />
              </div>
              <button
                onClick={() => window.open(banner, '_blank')}
                className="w-full btn-secondary text-sm"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AffiliateReferralLinks;
