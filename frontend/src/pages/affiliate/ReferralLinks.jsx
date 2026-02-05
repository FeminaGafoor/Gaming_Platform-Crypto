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
       
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 relative my-4 sm:my-8 max-h-[95vh] overflow-y-auto">

            {/* Close button */}
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <QrCode className="w-8 h-8 text-purple-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your QR Code</h2>
              <p className="text-gray-600 mb-6">
                Scan to visit your referral link
              </p>

              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
  <img
    src={linkData?.qr_code_url}
    alt="QR Code"
    className="w-full max-w-[200px] sm:max-w-[250px] mx-auto"
  />
</div>

              {/* Referral Code */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Referral Code</p>
                <code className="text-xl font-mono font-bold text-blue-600">
                  {linkData?.referral_code}
                </code>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
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
              <div className="mt-6 text-left bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">💡 Usage Tips:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Print on business cards</li>
                  <li>• Add to promotional flyers</li>
                  <li>• Display at events or storefronts</li>
                  <li>• Share in presentations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="text-center py-8 text-gray-500">
          Banners coming soon! Use your QR code for now.
        </div>
      </div>
    </div>
  );
};

export default AffiliateReferralLinks;
