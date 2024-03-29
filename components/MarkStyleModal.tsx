import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Radio, Slider } from 'antd';
import TwitterPicker from 'react-color/lib/Twitter';
import { useCookies } from 'react-cookie';
import { useTranslation } from '../i18n';
import MarkStyleSVG from './sub/MarkStyleSVG';
import hexToRgbA from '../logics/hexToRgbA';

export default function MarkStyleModal(props) {
  const { t, i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(['setting']);

  const {
    markStyle,
    setMarkStyle,
    markColor,
    setMarkColor,
    markOpacity,
    setMarkOpacity,
    visible,
    setStyleModal,
  } = props;

  const [sampleStyle, setSampleStyle] = useState('');
  const [sampleColor, setSampleColor] = useState('');
  const [sampleOpacity, setSampleOpacity] = useState(0.9);

  const options = [
    { label: t('MODAL_MARKSTYLE_CHECK'), value: 'check' },
    { label: t('MODAL_MARKSTYLE_CIRCLE'), value: 'circle' },
    { label: t('MODAL_MARKSTYLE_X'), value: 'x' },
    { label: t('MODAL_MARKSTYLE_PAINT'), value: 'paint' },
  ];

  useEffect(() => {
    setSampleStyle(markStyle);
    setSampleColor(markColor);
    setSampleOpacity(markOpacity);
  }, [markStyle, markColor, markOpacity]);

  const saveStyleAndColor = useCallback((nextStyle, nextColor, nextOpacity) => {
    setStyleModal(false);
    const nextSetting = {
      style: nextStyle,
      color: nextColor,
      opacity: nextOpacity,
    };
    setCookie('setting', nextSetting, { path: '/' });
    setMarkStyle(nextStyle);
    setMarkColor(nextColor);
    setMarkOpacity(nextOpacity);
  }, []);

  const cancelStyleAndColor = useCallback(() => {
    setStyleModal(false);
    setTimeout(() => {
      //모달 사라질때 이전 옵션 잠깐 깜빡이면서 남아있는거 방지
      setSampleStyle(markStyle);
      setSampleColor(markColor);
      setMarkOpacity(markOpacity);
    }, 500);
  }, [markStyle, markColor, markOpacity]);

  return (
    <Modal
      title={t('PLAYPAGE_SETTING')}
      visible={visible}
      onOk={() => saveStyleAndColor(sampleStyle, sampleColor, sampleOpacity)}
      onCancel={() => cancelStyleAndColor()}
    >
      <Radio.Group
        options={options}
        onChange={(e) => setSampleStyle(e.target.value)}
        value={sampleStyle}
        optionType="button"
        buttonStyle="solid"
        style={{ marginBottom: 16 }}
      />
      <MarkStyleSVG
        markStyle={sampleStyle}
        markColor={sampleColor !== '' && hexToRgbA(sampleColor, sampleOpacity)}
        markWidth={100}
      />
      <SampleView
        markStyle={sampleStyle}
        markColor={sampleColor !== '' && hexToRgbA(sampleColor, sampleOpacity)}
      >
        {/* {t("MODAL_MARKSTYLE_SAMPLE")} */}
      </SampleView>

      <div style={{ marginTop: 16 }}>
        <TwitterPicker
          color={sampleColor}
          onChangeComplete={(v) => {
            setSampleColor(v.hex);
          }}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        {t('MODAL_MARKSTYLE_OPACITY')} ({Math.round(sampleOpacity * 100)}%)
        <Slider
          defaultValue={markOpacity * 100}
          max={100}
          min={20}
          onChange={(v) => setSampleOpacity(Math.round(v) / 100)}
        />
      </div>
    </Modal>
  );
}

const SampleView = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.9);
  background-color: ${(props) =>
    props.markStyle === 'paint' ? props.markColor : 'white'};
  /* background-image: ${(props) =>
    props.markStyle === 'paint' ||
    `url("/static/images/${props.markStyle}.png")`} ;  */
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* margin-top: 1rem;
    margin-bottom: 1rem; */
`;
