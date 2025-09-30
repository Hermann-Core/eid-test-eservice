import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, Loader2, Lock, MapPin, FileText, Award } from "lucide-react";
import type {
  AuthenticationConfig,
  OperationsRequest,
  AttributeRequestType,
  EIDTypeSelection,
  LevelOfAssurance,
} from "@/types/eid";

const attributeLabels: Record<keyof OperationsRequest, string> = {
  DocumentType: "Document Type",
  IssuingState: "Issuing State",
  DateOfExpiry: "Date of Expiry",
  GivenNames: "Given Names",
  FamilyNames: "Family Names",
  ArtisticName: "Artistic Name",
  AcademicTitle: "Academic Title",
  DateOfBirth: "Date of Birth",
  PlaceOfBirth: "Place of Birth",
  Nationality: "Nationality",
  BirthName: "Birth Name",
  PlaceOfResidence: "Place of Residence",
  CommunityID: "Community ID",
  ResidencePermitI: "Residence Permit I",
  RestrictedID: "Restricted ID",
  AgeVerification: "Age Verification",
  PlaceVerification: "Place Verification",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [operations, setOperations] = useState<OperationsRequest>({
    DocumentType: "PROHIBITED",
    IssuingState: "PROHIBITED",
    DateOfExpiry: "PROHIBITED",
    GivenNames: "PROHIBITED",
    FamilyNames: "PROHIBITED",
    ArtisticName: "PROHIBITED",
    AcademicTitle: "PROHIBITED",
    DateOfBirth: "PROHIBITED",
    PlaceOfBirth: "PROHIBITED",
    Nationality: "PROHIBITED",
    BirthName: "PROHIBITED",
    PlaceOfResidence: "PROHIBITED",
    CommunityID: "PROHIBITED",
    ResidencePermitI: "PROHIBITED",
    RestrictedID: "PROHIBITED",
    AgeVerification: "PROHIBITED",
    PlaceVerification: "PROHIBITED",
  });

  const [ageVerification, setAgeVerification] = useState({
    enabled: false,
    age: 18,
  });

  const [placeVerification, setPlaceVerification] = useState({
    enabled: false,
    communityId: "027605",
  });

  const [transactionInfo, setTransactionInfo] = useState({
    enabled: false,
    info: "Test transaction information",
  });

  const [transactionAttestation, setTransactionAttestation] = useState({
    enabled: false,
    format: "http://bsi.bund.de/eID/ExampleAttestationFormat",
    context: "id599456-df",
  });

  const [levelOfAssurance, setLevelOfAssurance] = useState<
    LevelOfAssurance | ""
  >("");

  const [eidTypes, setEidTypes] = useState({
    CardCertified: false,
    SECertified: false,
    SEEndorsed: false,
    HWKeyStore: false,
  });

  const handleOperationChange = (
    key: keyof OperationsRequest,
    value: AttributeRequestType
  ) => {
    setOperations((prev) => ({ ...prev, [key]: value }));
  };

  const handleEidTypeChange = (key: string, checked: boolean) => {
    setEidTypes((prev) => ({ ...prev, [key]: checked }));
  };

  const startAuthentication = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build configuration
      const config: AuthenticationConfig = {
        operations,
        ageVerification,
        placeVerification,
        transactionAttestation,
        transactionInfo,
        levelOfAssurance: levelOfAssurance || undefined,
        eidTypeRequest: {
          ...(eidTypes.CardCertified && {
            CardCertified: "ALLOWED" as EIDTypeSelection,
          }),
          ...(eidTypes.SECertified && {
            SECertified: "ALLOWED" as EIDTypeSelection,
          }),
          ...(eidTypes.SEEndorsed && {
            SEEndorsed: "ALLOWED" as EIDTypeSelection,
          }),
          ...(eidTypes.HWKeyStore && {
            HWKeyStore: "ALLOWED" as EIDTypeSelection,
          }),
        },
      };

      // Call start authentication API
      const response = await fetch("/api/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start authentication");
      }

      const data = await response.json();

      // Trigger eID-Client
      const eidClientUrl = `http://127.0.0.1:24727/eID-Client?tcTokenURL=${encodeURIComponent(
        data.tcTokenUrl
      )}`;

      // Open in new window or redirect
      window.location.href = eidClientUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Apple-inspired Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full filter blur-3xl opacity-40 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative py-4 px-6 backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl backdrop-blur-xl"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                eID Test Service
              </h1>
              <p className="text-gray-600 text-xs font-medium">
                Configure and test your eID authentication flow
              </p>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-4">
        {/* Operations Section - Compact Glass Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Personal Data Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {Object.entries(operations).map(([key, value]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {attributeLabels[key as keyof OperationsRequest]}
                  </label>
                  <div className={`w-2 h-2 rounded-full shadow-sm ${
                    value === 'REQUIRED' ? 'bg-green-500 shadow-green-200' :
                    value === 'ALLOWED' ? 'bg-yellow-500 shadow-yellow-200' : 'bg-gray-400 shadow-gray-200'
                  }`}></div>
                </div>
                <select
                  value={value}
                  onChange={(e) =>
                    handleOperationChange(
                      key as keyof OperationsRequest,
                      e.target.value as AttributeRequestType
                    )
                  }
                  className="w-full px-2 py-1.5 text-xs bg-white/80 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm shadow-sm"
                >
                  <option value="PROHIBITED">PROHIBITED</option>
                  <option value="ALLOWED">ALLOWED</option>
                  <option value="REQUIRED">REQUIRED</option>
                </select>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Verifications Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Verifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Age Verification */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={ageVerification.enabled}
                  onChange={(e) => setAgeVerification(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-500 bg-white/80 border-gray-300 rounded focus:ring-blue-400/50"
                />
                <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  Age Verification
                </label>
              </div>
              <AnimatePresence>
                {ageVerification.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                   <div className="flex items-center gap-2 mb-2">
                     <Award className="w-3 h-3 text-blue-500" />
                     <span className="text-xs text-gray-600">Minimum age requirement</span>
                   </div>
                   <input
                     type="number"
                     value={ageVerification.age}
                     onChange={(e) => setAgeVerification(prev => ({ ...prev, age: parseInt(e.target.value) || 18 }))}
                     className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
                     min="1"
                     max="120"
                   />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Place Verification */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={placeVerification.enabled}
                  onChange={(e) => setPlaceVerification(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-500 bg-white/80 border-gray-300 rounded focus:ring-blue-400/50"
                />
                <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  Place Verification
                </label>
              </div>
              <AnimatePresence>
                {placeVerification.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">Community ID to verify</span>
                    </div>
                    <input
                      type="text"
                      value={placeVerification.communityId}
                      onChange={(e) => setPlaceVerification(prev => ({ ...prev, communityId: e.target.value }))}
                      className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
                      placeholder="Enter community ID"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>

        {/* Additional Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-500" />
            Additional Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Level of Assurance */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors mb-2 block">
                Level of Assurance
              </label>
              <select
                value={levelOfAssurance}
                onChange={(e) => setLevelOfAssurance(e.target.value as LevelOfAssurance)}
                className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
              >
                <option value="">Not specified</option>
                <option value="http://bsi.bund.de/eID/LoA/low">Low</option>
                <option value="http://bsi.bund.de/eID/LoA/substantiell">Substantial</option>
                <option value="http://bsi.bund.de/eID/LoA/hoch">High</option>
                <option value="http://bsi.bund.de/eID/LoA/undefined">Undefined</option>
              </select>
            </motion.div>

            {/* EID Types */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors mb-2 block">
                Supported eID Types
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(eidTypes).map(([key, checked]) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => handleEidTypeChange(key, e.target.checked)}
                      className="w-3 h-3 text-blue-500 bg-white/80 border-gray-300 rounded focus:ring-blue-400/50"
                    />
                    <span className="text-xs text-gray-700">{key}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Transaction Configuration */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Transaction Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Transaction Info */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={transactionInfo.enabled}
                  onChange={(e) => setTransactionInfo(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-500 bg-white/80 border-gray-300 rounded focus:ring-blue-400/50"
                />
                <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  Transaction Info
                </label>
              </div>
              <AnimatePresence>
                {transactionInfo.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-3 h-3 text-indigo-500" />
                      <span className="text-xs text-gray-600">Transaction description</span>
                    </div>
                    <input
                      type="text"
                      value={transactionInfo.info}
                      onChange={(e) => setTransactionInfo(prev => ({ ...prev, info: e.target.value }))}
                      className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
                      placeholder="Enter transaction information"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Transaction Attestation */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="group relative backdrop-blur-xl bg-white/70 border border-white/40 rounded-xl p-3 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={transactionAttestation.enabled}
                  onChange={(e) => setTransactionAttestation(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="w-4 h-4 text-blue-500 bg-white/80 border-gray-300 rounded focus:ring-blue-400/50"
                />
                <label className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  Transaction Attestation
                </label>
              </div>
              <AnimatePresence>
                {transactionAttestation.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="space-y-1.5 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-gray-600">Format</span>
                      </div>
                      <input
                        type="text"
                        value={transactionAttestation.format}
                        onChange={(e) => setTransactionAttestation(prev => ({ ...prev, format: e.target.value }))}
                        className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
                        placeholder="Attestation format"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-purple-500" />
                        <span className="text-xs text-gray-600">Context</span>
                      </div>
                      <input
                        type="text"
                        value={transactionAttestation.context}
                        onChange={(e) => setTransactionAttestation(prev => ({ ...prev, context: e.target.value }))}
                        className="w-full px-2 py-1.5 text-xs bg-white/90 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 backdrop-blur-sm shadow-sm"
                        placeholder="Context identifier"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>

        {/* Start Authentication Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAuthentication}
            disabled={loading}
            className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden shadow-lg ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white hover:from-blue-400 hover:via-purple-400 hover:to-indigo-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:shadow-purple-500/30'
            } backdrop-blur-xl border border-white/30`}
          >
            <div className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Start Authentication
                </>
              )}
            </div>
            
            {/* Animated background gradient */}
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
            
            {/* Shimmer effect */}
            {!loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </motion.button>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl backdrop-blur-xl shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
