import React, { useEffect, useState } from "react";
import { Collapse, Spin, theme } from "antd";
import {
    Shield,
    FileText,
    Globe,
    Cookie,
    Users,
    Smartphone,
    GitMerge,
    RefreshCw,
    ChevronDown
} from "lucide-react";
import { getPrivacyPage } from "../../Api/api";

const { Panel } = Collapse;
const { useToken } = theme;

export default function PrivacyPolicyContent() {
    const [privacy, setPrivacy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeKeys, setActiveKeys] = useState(["generalInformation"]);
    const { token } = useToken();

    useEffect(() => {
        getPrivacyPage().then((res) => {
            if (res.data) {
                setPrivacy(res.data);
            }
            setLoading(false);
        });
    }, []);

    const sections = [
        {
            key: "generalInformation",
            title: "General Information",
            icon: Shield,
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            key: "website",
            title: "Website",
            icon: Globe,
            gradient: "from-purple-500 to-pink-500"
        },
        {
            key: "cookies",
            title: "Cookies",
            icon: Cookie,
            gradient: "from-amber-500 to-orange-500"
        },
        {
            key: "socialMedia",
            title: "Social Media",
            icon: Users,
            gradient: "from-green-500 to-emerald-500"
        },
        {
            key: "app",
            title: "App",
            icon: Smartphone,
            gradient: "from-indigo-500 to-purple-500"
        },
        {
            key: "integration",
            title: "Integration",
            icon: GitMerge,
            gradient: "from-red-500 to-rose-500"
        },
        {
            key: "changesPrivacy",
            title: "Changes to Privacy Policy",
            icon: RefreshCw,
            gradient: "from-gray-600 to-slate-700"
        },
    ];

    const handlePanelChange = (keys) => {
        setActiveKeys(keys);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="relative">
                        <Spin size="large" />
                        <Shield className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" />
                    </div>
                    <p className="mt-4 text-lg text-gray-600 font-medium">Loading Privacy Policy...</p>
                </div>
            </div>
        );
    }

    if (!privacy) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex justify-center items-center py-20">
                <div className="text-center max-w-md">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Unavailable</h3>
                    <p className="text-gray-600">No Privacy Policy content found at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">

            {/* Content Section */}
            <div className="mx-auto md:ml-20 md:mr-20 md:px-6 py-16 -mt-10 relative z-10">

                {/* Enhanced Accordion */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <Collapse
                        accordion
                        activeKey={activeKeys}
                        onChange={handlePanelChange}
                        bordered={false}
                        expandIcon={({ isActive }) => (
                            <div className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : ''
                                }`}>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                        expandIconPosition="end"
                        className="privacy-accordion"
                    >
                        {sections.map((section) => {
                            const IconComponent = section.icon;
                            const isActive = activeKeys.includes(section.key);

                            return (
                                <Panel
                                    key={section.key}
                                    header={
                                        <div className="flex items-center space-x-4 py-2">
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${section.gradient} flex items-center justify-center shadow-lg`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h3 className={`text-lg font-semibold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {section.title}
                                                </h3>
                                                <p className={`text-sm transition-colors ${isActive ? 'text-gray-600' : 'text-gray-500'
                                                    }`}>
                                                    Click to {isActive ? 'collapse' : 'expand'} section details
                                                </p>
                                            </div>
                                        </div>
                                    }
                                    className={`border-b border-gray-100 last:border-b-0 transition-all duration-300 ${isActive ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'
                                        }`}
                                >
                                    <div className="md:pl-6 md:pr-6 pb-6">
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                            <div
                                                className="prose max-w-none text-gray-700 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        privacy[section.key]?.content?.en ||
                                                        "<p class='text-gray-500 italic'>No content available for this section.</p>",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Panel>
                            );
                        })}
                    </Collapse>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700 font-medium">
                            Last updated: {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .privacy-accordion .ant-collapse-item {
                    border-radius: 0 !important;
                }
                
                .privacy-accordion .ant-collapse-header {
                    padding: 24px 32px !important;
                    align-items: center !important;
                }
                
                .privacy-accordion .ant-collapse-content-box {
                    padding: 0 !important;
                }

                .privacy-accordion li {
                    font-size:16px !important;
                    margin-bottom: 6px;
                    list-style: disc;
                }
                      .privacy-accordion ol {
                   padding-left:20px;
                }

                .privacy-accordion p {
                    font-size:16px !important;
                }

                  .privacy-accordion h2 {
                    font-size:30px !important;
                }

                 .privacy-accordion h1 {
                    font-size:40px !important;
                }
                
                
                .privacy-accordion .ant-collapse-item-active .ant-collapse-header {
                    background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
                }

            @media(max-width:600px){
.privacy-accordion h2 {
    font-size: 24px !important;
}
        .terms-conditions p {
          line-height: 1.7;
          font-size:16px !important;
        }
        }
            `}</style>
        </div>
    );
}