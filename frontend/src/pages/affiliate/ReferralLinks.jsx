import { useState, useEffect } from 'react';
import { affiliateAPI } from '../../services/api';
import { Copy, Check, ExternalLink, QrCode, X } from 'lucide-react';

const AffiliateReferralLinks = () => {
  const [linkData, setLinkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

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

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = linkData?.qr_code_url;
    link.download = `qr-code-${linkData?.referral_code}.png`;
    link.click();
  };

  if (loading) {
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
          Referral Links
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Your unique tracking links and promotional materials</p>
      </div>

      {/* Main Referral Link */}
      <div className="card shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800/30">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Referral Code</h2>
            <div className="flex items-center space-x-3">
              <code className="bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 border-2 border-blue-300 dark:border-blue-700 shadow-lg">
                {linkData?.referral_code}
              </code>
              <button
                onClick={() => copyToClipboard(linkData?.referral_code, 'code')}
                className="p-4 bg-white dark:bg-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105"
              >
                {copied === 'code' ? (
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Full Referral URL</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={linkData?.referral_url || ''}
                readOnly
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono text-sm"
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
        <div className="card shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Short URL</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Perfect for social media and messaging</p>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={linkData?.short_url || ''}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(linkData?.short_url, 'short')}
              className="p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:scale-110"
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
        <div className="card shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">QR Code</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">For offline marketing and print materials</p>
          <button
            onClick={() => setShowQRModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>View QR Code</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 sm:p-8 relative my-4 sm:my-8 max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-gray-200 dark:border-gray-700">
            {/* Close button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-4 shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your QR Code</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Scan to visit your referral link
              </p>

              {/* QR Code Image */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 mb-6 shadow-inner">
                <img
                  src={linkData?.qr_code_url}
                  alt="QR Code"
                  className="w-full max-w-[220px] sm:max-w-[280px] mx-auto rounded-xl"
                />
              </div>

              {/* Referral Code */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-5 mb-6 border-2 border-blue-200 dark:border-blue-800/30">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Referral Code</p>
                <code className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {linkData?.referral_code}
                </code>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={downloadQR}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Close
                </button>
              </div>

              {/* Tips */}
              <div className="text-left bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800/30">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-3 flex items-center">
                  <span className="mr-2">💡</span> Usage Tips:
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Print on business cards</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Add to promotional flyers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Display at events or storefronts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Share in presentations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
          How to Use Your Referral Links
        </h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800/30 hover:scale-105 transition-all duration-300">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              1
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Share Your Link</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy your referral URL and share it on social media, blogs, forums, or via email
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800/30 hover:scale-105 transition-all duration-300">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              2
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Track Performance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor clicks, registrations, and conversions in real-time from your dashboard
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800/30 hover:scale-105 transition-all duration-300">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
              3
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Earn Commissions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive ${linkData?.cpa_amount || 50} for every player who deposits through your link
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Links */}
      <div className="card shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Banner Images</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Download pre-made banners with your tracking code</p>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-850/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          Banners coming soon! Use your QR code for now.
        </div>
      </div>
    </div>
  );
};

export default AffiliateReferralLinks;
