// pages/index.tsx

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
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

const getSelectColor = (value: AttributeRequestType) => {
  switch (value) {
    case "REQUIRED":
      return "bg-blue-500/10 text-blue-800 border-blue-500/20";
    case "ALLOWED":
      return "bg-green-500/10 text-green-800 border-green-500/20";
    case "PROHIBITED":
      return "bg-gray-500/10 text-gray-800 border-gray-500/20";
    default:
      return "bg-white/50 text-gray-900 border-gray-300/50";
  }
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

  const [transactionAttestation, setTransactionAttestation] = useState({
    enabled: false,
    format: "http://bsi.bund.de/eID/ExampleAttestationFormat",
    context: "id599456-df",
  });

  const [levelOfAssurance, setLevelOfAssurance] = useState<
    LevelOfAssurance | ""
  >("");

  const [transactionInfo, setTransactionInfo] = useState({
    enabled: false,
    info: "Example transaction",
  });

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
      const config: AuthenticationConfig = {
        operations,
        levelOfAssurance: levelOfAssurance || undefined,
        eidTypeRequest: {
          ...(eidTypes.CardCertified && { CardCertified: "ALLOWED" }),
          ...(eidTypes.SECertified && { SECertified: "ALLOWED" }),
          ...(eidTypes.SEEndorsed && { SEEndorsed: "ALLOWED" }),
          ...(eidTypes.HWKeyStore && { HWKeyStore: "ALLOWED" }),
        },
      };

      if (ageVerification.enabled) {
        config.ageVerification = { age: ageVerification.age };
      }
      if (placeVerification.enabled) {
        config.placeVerification = {
          communityId: placeVerification.communityId,
        };
      }
      if (transactionAttestation.enabled) {
        config.transactionAttestation = {
          format: transactionAttestation.format,
          context: transactionAttestation.context,
        };
      }
      if (transactionInfo.enabled) {
        config.transactionInfo = { info: transactionInfo.info };
      }

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
      const eidClientUrl = `http://127.0.0.1:24727/eID-Client?tcTokenURL=${encodeURIComponent(
        data.tcTokenUrl
      )}`;
      window.location.href = eidClientUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 bg-[#fbfbfd]">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-white/25 via-purple-50/15 to-pink-50/15 border-b border-white/15">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">
              eID Test Service
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {/* Combined Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          {/* Operations Card - Takes 3 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-gradient-to-br from-white/20 via-purple-50/10 to-pink-50/10 backdrop-blur-2xl rounded-3xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Attribute Requests
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(operations).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col justify-between min-h-[90px] p-3 bg-white/40 rounded-lg shadow-sm"
                >
                  <label className="text-xs font-medium text-gray-700">
                    {attributeLabels[key as keyof OperationsRequest]}
                  </label>
                  <select
                    value={value}
                    onChange={(e) =>
                      handleOperationChange(
                        key as keyof OperationsRequest,
                        e.target.value as AttributeRequestType
                      )
                    }
                    className={`mt-auto px-3 py-2 backdrop-blur-sm border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all ${getSelectColor(
                      value
                    )}`}
                  >
                    <option value="PROHIBITED">Prohibited</option>
                    <option value="ALLOWED">Allowed</option>
                    <option value="REQUIRED">Required</option>
                  </select>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Advanced Config Column - Takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/20 via-purple-50/10 to-pink-50/10 backdrop-blur-2xl rounded-3xl border border-white/40 p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Verifications */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Verification Options
              </h3>
              <div className="mb-4 p-4 rounded-xl bg-blue-300/5">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={ageVerification.enabled}
                    onChange={(e) =>
                      setAgeVerification((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-500">
                    Age Verification
                  </span>
                </label>
                {ageVerification.enabled && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      value={ageVerification.age}
                      onChange={(e) =>
                        setAgeVerification((prev) => ({
                          ...prev,
                          age: parseInt(e.target.value) || 18,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="e.g., 18"
                      min="0"
                    />
                  </motion.div>
                )}
              </div>
              <div className="mb-4 p-4 rounded-xl bg-blue-300/5">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={placeVerification.enabled}
                    onChange={(e) =>
                      setPlaceVerification((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-500">
                    Place Verification
                  </span>
                </label>
                {placeVerification.enabled && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Community ID
                    </label>
                    <input
                      type="text"
                      value={placeVerification.communityId}
                      onChange={(e) =>
                        setPlaceVerification((prev) => ({
                          ...prev,
                          communityId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="e.g., 027605"
                    />
                  </motion.div>
                )}
              </div>

              {/* Transaction Attestation */}
              <div className="mb-4 p-4 rounded-xl bg-green-300/5">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={transactionAttestation.enabled}
                    onChange={(e) =>
                      setTransactionAttestation((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-500">
                    Transaction Attestation
                  </span>
                </label>
                {transactionAttestation.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 mt-2"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Format
                      </label>
                      <input
                        type="text"
                        value={transactionAttestation.format}
                        onChange={(e) =>
                          setTransactionAttestation((prev) => ({
                            ...prev,
                            format: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g., http://bsi.bund.de/eID/ExampleAttestationFormat"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Context
                      </label>
                      <input
                        type="text"
                        value={transactionAttestation.context}
                        onChange={(e) =>
                          setTransactionAttestation((prev) => ({
                            ...prev,
                            context: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g., id599456-df"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Transaction Info */}
              <div className="mb-4 p-4 rounded-xl bg-green-300/5">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={transactionInfo.enabled}
                    onChange={(e) =>
                      setTransactionInfo((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-500">
                    Transaction Info
                  </span>
                </label>
                {transactionInfo.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 mt-2"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Info
                      </label>
                      <input
                        type="text"
                        value={transactionInfo.info}
                        onChange={(e) =>
                          setTransactionInfo((prev) => ({
                            ...prev,
                            info: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g., Example transaction"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* LoA and eID Types */}
              <div className="p-4 rounded-xl bg-green-300/5">
                <label className="block text-sm font-semibold text-gray-500 mb-2">
                  Level of Assurance
                </label>
                <select
                  value={levelOfAssurance}
                  onChange={(e) =>
                    setLevelOfAssurance(e.target.value as LevelOfAssurance)
                  }
                  className="w-full px-3 py-2 bg-white/70 border border-gray-200/60 shadow-sm rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">None</option>
                  <option value="http://eidas.europa.eu/LoA/low">
                    eIDAS Low
                  </option>
                  <option value="http://eidas.europa.eu/LoA/substantial">
                    eIDAS Substantial
                  </option>
                  <option value="http://eidas.europa.eu/LoA/high">
                    eIDAS High
                  </option>
                  <option value="http://bsi.bund.de/eID/LoA/normal">
                    BSI Normal
                  </option>
                  <option value="http://bsi.bund.de/eID/LoA/substantiell">
                    BSI Substantiell
                  </option>
                  <option value="http://bsi.bund.de/eID/LoA/hoch">
                    BSI Hoch
                  </option>
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-white/20 via-purple-50/10 to-pink-50/10 backdrop-blur-2xl rounded-3xl border border-white/40 p-4 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                eID Types
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(eidTypes).map(([key, checked]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-3 rounded-xl bg-purple-400/10 cursor-pointer hover:bg-purple-500/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        handleEidTypeChange(key, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/\s/g, "")}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl"
          >
            <p className="text-red-700 font-medium text-center">{error}</p>
          </motion.div>
        )}

        {/* Apple-style CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={startAuthentication}
            disabled={loading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-base font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Starting authentication
                </>
              ) : (
                <>
                  Start eID Authentication
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
