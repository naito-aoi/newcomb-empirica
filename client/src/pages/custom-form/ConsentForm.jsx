import React, { useMemo, useRef } from "react";
import { Survey } from "survey-react-ui";
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { themeJson } from "../../styles/survey_theme.js";

import { useReactToPrint } from "react-to-print";

// Consent and player registration in one `playerCreate` form (same approach as mta0-experiment).
// Empirica's built-in consent step is remembered in the browser and skipped on later visits, so it
// is disabled in App.jsx; here the consent is shown whenever a participant has to be registered,
// and completing it ("Start") registers the player through onPlayerID.
//
// The consent text below is the exp4 version (hypothetical situation, fixed payment, single round).
// The previous text (exp1-3: bonus based on the boxes, pre-task survey, AI chatbot conversation,
// multiple rounds) is kept in ConsentForm.original-exp1-3.jsx.bak next to this file.
export function ConsentForm({ onPlayerID, connecting }) {
    // As in the former PlayerForm, the participant ID comes from the URL parameter.
    const urlParams = new URLSearchParams(window.location.search);
    const playerID = urlParams.get("participantKey") || "";

    const consentJson = {
        "name": "consent",
        "completeText": "Start",
        "elements": [
            {
                "type": "panel",
                "name": "panel",
                "elements": [
                    {
                        "type": "html",
                        "name": "inst1Text",
                        "html": `
                            <img src="/fig/cmu-wordmark.svg" id="cmu-logo" alt=""/>
                            <h5 id="consent-title">
                                Online Consent
                            </h5>
                            <p id="consent-studynumber">
                                (STUDY2024_00000446)
                            </p>
                            <div id="consent-body" class="consent-scrollbox">
                            <p>
                                This task is part of a research study conducted by Hirokazu Shirado at Carnegie Mellon University and is funded by the NOMIS Foundation.
                            </p>
                            <h5 id="consent-subtitle">
                                Summary
                            </h5>
                            <p>
                                In this study, you will engage in decision-making tasks with or without third-party predictions. You might enjoy participating if you are interested in exploring these tasks with monetary compensation. However, if you prefer not to make decisions under these conditions or might find the process uncomfortable, you may choose not to participate. Your responses are anonymous, and while there is minimal risk involved, participation is entirely voluntary.
                            </p>
                            <h5 id="consent-subtitle">
                                Purpose
                            </h5>
                            <p>
                                This study explores how people make decisions with third-party predictions.
                            </p>
                            <h5 id="consent-subtitle">
                                Procedures 
                            </h5>
                            <p>
                                Once you consented, you will receive a tutorial tailored to the study’s tasks, followed by a comprehension assessment covering the task instructions. If you do not pass the comprehension test, you are disqualified from the study and will not have an opportunity to rejoin. If more than the required number of participants qualify, the surplus subjects will receive base pay and be dismissed from the study. If fewer participants qualify than required, all subjects are dismissed and paid the base rate.
                                In the main task phase, you are asked to consider a hypothetical decision-making situation and indicate what you would choose. In the situation, you face two boxes: Box A, which contains a small, guaranteed endowment, and Box B, which may contain a larger endowment depending on a predictor’s assessment. You choose between (1) selecting only Box B or (2) selecting both Boxes A and B. When a predictor is present, you will be informed that Box B’s endowment is based on the predictor’s forecast of your choice.
                                You are notified of the predictor’s presence and identity before making your choice. The situation is hypothetical: the money described in it will not be paid, and your payment does not depend on your choices. Each session (a single Prolific task) consists of one round. Subjects receive a fixed payment for their participation in a session. Subjects will be asked to provide their sociodemographic information in a post-task survey, with the choice to skip these questions if preferred.
                                The total task time will be about 15 minutes. Regardless of the reasons, your non-participation in the actual game will not result in a negative rating on Prolific.
                            </p>
                            <h5 id="consent-subtitle">
                                Participant Requirements
                            </h5>
                            <p>
                                Participation in this study is limited to individuals age 18 and older. 
                            </p>
                            <h5 id="consent-subtitle">
                                Risks
                            </h5>
                            <p>
                            Participants may face a risk of confidentiality breach through their Prolific IDs. Since these IDs are universal over all tasks on the platform, combining the data collected through this study with other Prolific tasks via their IDs may lead to the identification of participants' information. 
                            </p>
                            <h5 id="consent-subtitle">
                                Payment Confidentiality 
                            </h5>
                            <p>
                                Payment methods, especially those facilitated by third-party vendors (such as Venmo, Amazon, PayPal), may require that the researchers and/or the vendor collect and use personal information (such as your first and last name, email addresses, phone numbers, banking information) provided by you in order for your payment to be processed. As with any payment transaction, there is the risk of a breach of confidentiality from the third-party vendor. All personal information collected by the researcher will be held as strictly confidential and stored in a password-protected digital file, or in a locked file cabinet, until payments are processed and reconciled. This information will be destroyed at the earliest acceptable time. Personal information held by the third-party vendor will be held according to their terms of use policy.”
                            </p>
                            <h5 id="consent-subtitle">
                                Benefits
                            </h5>
                            <p>
                                The study aims to contribute to how people’s belief in prediction can change their decision-making. The insights gained from this research can inform people, including subjects, of how to manage unintentional social harms of prediction systems.
                            </p>
                            <h5 id="consent-subtitle">
                                Compensation & Costs
                            </h5>
                            <p>
                                The task duration is approximately 15 minutes. You will receive a fixed payment for completing the task, as stated on the Prolific study page. Your payment does not depend on your choices in the task, and there is no performance-based bonus.
                                In the hypothetical situation, you will choose between two options: (A) selecting both Box A and Box B, or (B) selecting only Box B. Box A contains a guaranteed $1. If a third-party predictor forecasts that the participant will choose option (A), Box B will contain $0; otherwise, Box B will contain $3. These amounts are part of the hypothetical situation and will not be paid.
                                There will be no cost to you if you participate in this study.  
                            </p>
                            <h5 id="consent-subtitle">
                                Future Use of Information 
                            </h5>
                            <p>
                                We may use the anonymous data for our future research studies, or we may distribute the data to other researchers for their research studies.  We would do this without getting additional informed consent from you (or your legally authorized representative).  Sharing of data with other researchers will only be done in such a manner that you will not be identified.
                            </p>
                            <h5 id="consent-subtitle">
                                Confidentiality
                            </h5>
                            <p>
                                The data captured for the research does not include any personally identifiable information about you. The sponsor of this research, the NOMIS Foundation, may have access to the research record. The study will utilize Prolific to conduct this research. This company and its services are not owned or operated by CMU. CMU is not collecting any identifiable information. However, the study is being done through the Prolific. CMU will be receiving coded data from Prolific (coded with the individual's Prolific ID). Prolific is not giving CMU the code that would allow CMU to identify the participants. Prolific generally collects certain identifiable information from Prolific users under Prolific's terms and conditions. However, CMU does not control Prolific's collection or use of information from Prolific users, and CMU does not receive identifiable information from Prolific.
                            </p>
                            <h5 id="consent-subtitle">
                                Right to Ask Questions & Contact Information
                            </h5>
                            <p>
                                If you have any questions about this study, you should feel free to ask them by contacting the Principal Investigator now at Hirokazu Shirado (shirado@cmu.edu).  If you have questions later, desire additional information, or wish to withdraw your participation please contact the Principal Investigator by e-mail in accordance with the contact information listed above.  
                                If you have questions pertaining to your rights as a research participant, or to report concerns about this study, you should contact the Office of Research Integrity and Compliance at Carnegie Mellon University.  Email: irb-review@andrew.cmu.edu . Phone: 412-268-4721.
                            </p>
                            <h5 id="consent-subtitle">
                                Voluntary Participation
                            </h5>
                            <p>
                                Your participation in this research is voluntary. You may refuse or discontinue participation at any time without any loss of benefits to which you are otherwise entitled. You may print a copy of this consent form for your records.
                            </p>
                            </div>
                        `
                    }
                ],
            }, {
                "type": "panel",
                "name": "panel1",
                "elements": [
                    {
                        "type": "html",
                        "name": "inst1Text",
                        "html": `
                            <h5>
                                Online Consent Form
                            </5>
                            <br> 
                            <p><small>
                                To proceed with the task, you must agree to all of the following.
                            </small></p>
                        `
                    }, {
                        "type": "boolean",
                        "name": "age",
                        "title": "I am age 18 or older.",
                        "isRequired": true,
                        "valueTrue": "Yes",
                        "valueFalse": "No"
                    }, {
                        "type": "boolean",
                        "name": "understanding",
                        "title": "I have read and understand the information above.",
                        "isRequired": true,
                        "valueTrue": "Yes",
                        "valueFalse": "No"
                    }, {
                        "type": "boolean",
                        "name": "eligibility",
                        "title": "I want to participate in this research and continue with the task.",
                        "isRequired": true,
                        "valueTrue": "Yes",
                        "valueFalse": "No"
                    }, {
                        "type": "boolean",
                        "name": "willingness",
                        "title": "I have reviewed the eligibility requirements listed in the Participant Requirements section of the consent form and certify that I am eligible to participate in this research, to the best of my knowledge.",
                        "isRequired": true,
                        "valueTrue": "Yes",
                        "valueFalse": "No"
                    }
                ],
                "showQuestionNumbers": "off"
            }
        ]
    };

    // Keep the latest props reachable from the handlers without recreating the model.
    const connectingRef = useRef(connecting);
    connectingRef.current = connecting;
    const onPlayerIDRef = useRef(onPlayerID);
    onPlayerIDRef.current = onPlayerID;

    // Create the model only once so that the answers survive the re-render caused by `connecting`.
    const survey = useMemo(() => {
        const m = new Model(consentJson);
        m.applyTheme(themeJson);
        m.showCompletedPage = false;
        m.onValidateQuestion.add((sender, options) => {
            if (options.name === "age" || options.name === "understanding" || options.name === "eligibility" || options.name === "willingness") {
                if (options.value !== "Yes") {
                    options.error = "Oops! You are required to answer Yes to proceed.";
                }
            }
        });
        // Prevent a second submission while the registration is in progress.
        m.onCompleting.add((sender, options) => {
            if (connectingRef.current) {
                options.allow = false;
            }
        });
        // Giving consent registers the player (formerly PlayerForm's handleSubmit).
        m.onComplete.add(() => {
            onPlayerIDRef.current(playerID);
        });
        return m;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    // Without a participant ID in the URL, nobody can be registered (formerly an alert in PlayerForm).
    if (!playerID.trim()) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <div className="bg-white py-8 px-10 shadow sm:rounded-lg text-center">
                    <h2 className="text-xl font-bold text-gray-900">Invalid URL</h2>
                    <p className="mt-4 text-sm text-gray-500">
                        This is not a valid URL. Please contact the researcher.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[60%] max-w-300 min-w-230 mx-auto sm:mt-5 px-20 py-10 font-sans">
            <div className="mt-6" ref={contentRef}>
                <Survey model={survey} />
            </div>
            {/* <button 
                onClick={reactToPrintFn} 
                className="flex items-center ml-auto mr-10 mt-1 px-2 py-1 border text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500 border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
                Print this page
            </button>             */}
        </div>
    );
}