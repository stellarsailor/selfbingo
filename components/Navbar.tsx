// import Link from 'next/link'
import styled from 'styled-components';
import {
  Input,
  Row,
  Col,
  Popover,
  Button,
  message,
  Modal,
  Dropdown,
  Menu,
} from 'antd';
import { Link, useTranslation, Router } from '../i18n';
import {
  MenuOutlined,
  GlobalOutlined,
  UserOutlined,
  EditOutlined,
} from '../assets/icons';
import { useEffect, useState, useCallback, useContext } from 'react';
import { InitialContents } from '../store/InitialContentsProvider';
import { CenteredCol, CenteredRow } from './sub/styled';
import langCodeToLanguage from '../logics/langCodeToLanguage';
import useIsMobile from '../logics/useIsMobile';

import { signIn, signOut, useSession } from 'next-auth/client';

const { Search } = Input;
message.config({
  top: 58,
});
const { confirm } = Modal;

export default function NavBar({}) {
  const [session, loading] = useSession();
  // const { formatMessage: tr } = useIntl();
  const { t, i18n } = useTranslation();
  const { fetchMainBingos } = useContext(InitialContents);

  const [supportedLanguages, setSupportedLanguages] = useState(
    i18n.options.supportedLngs || []
  );

  const handleSearch = useCallback((searchParam) => {
    if (searchParam === '') {
      message.warning(t('SEARCH_INPUT_NULL_ALERT'));
    } else {
      Router.push(`/bingo?search=${searchParam}`);
    }
  }, []);

  const langMenu = (
    <Menu>
      {supportedLanguages.map((v, index) => {
        if (index !== supportedLanguages.length - 1)
          return (
            <Menu.Item
              key={index}
              onClick={() => {
                i18n.changeLanguage(v);
              }}
              style={{ padding: '8px 20px' }}
            >
              {langCodeToLanguage(v)}
            </Menu.Item>
          );
      })}
      {/* <Menu.Divider /> */}
    </Menu>
  );

  const hamburgerMenu = (
    <Menu style={{ width: 240 }}>
      {!session ? (
        <Menu.Item style={{ padding: '8px 20px' }}>
          <Link href="/auth/signin">
            {/* <Button type="primary" style={{width: 150, margin: '8px 20px'}} onClick={(e) => console.log()}> */}
            <a style={{ color: 'dodgerblue' }}>{t('SIGN_IN')}</a>
            {/* </Button> */}
          </Link>
        </Menu.Item>
      ) : (
        <div
          style={{ padding: '8px 20px', display: 'flex', flexDirection: 'row' }}
        >
          {/* {session.user.image && <span style={{backgroundImage: `url(${session.user.image})` }} />} */}
          <CenteredCol>
            <UserOutlined style={{ fontSize: 20, marginRight: 10 }} />
          </CenteredCol>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>
              <strong>{session.user.name}</strong>
              {/* <small style={{color: 'dodgerblue'}}><EditOutlined /></small> */}
            </span>
            <small>{session.user.email}</small>
          </div>
        </div>
      )}
      <Menu.Item style={{ padding: '8px 20px' }}>
        <Link href="/bingo/create">
          <a> {t('CREATE_SELFBINGO')} </a>
        </Link>
      </Menu.Item>
      <Menu.Item style={{ padding: '8px 20px' }}>
        <Link href="/about">
          <a> {t('ETC_ABOUT')} </a>
        </Link>
      </Menu.Item>
      <Menu.Item style={{ padding: '8px 20px' }}>
        <Link href="/terms">
          <a> {t('ETC_TERMS_OF_SERVICE')} </a>
        </Link>
      </Menu.Item>
      <Menu.Item style={{ padding: '8px 20px' }}>
        <Link href="/privacy">
          <a> {t('ETC_PRIVACY_POLICY')} </a>
        </Link>
      </Menu.Item>
      {session && <Menu.Divider />}
      {session && (
        <Menu.Item style={{ padding: '8px 20px' }}>
          <a onClick={() => signOut()}> {t('SIGN_OUT')} </a>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <NavigationBar>
      <Row
        justify="center"
        style={{ height: 50, display: 'flex', alignItems: 'center' }}
      >
        <Col xs={0} sm={22} md={20} lg={20} xl={12}>
          <CenterAlign>
            <Link href="/">
              <a>
                <img
                  src="/static/images/icon.png"
                  alt="Selfbingo Icon"
                  style={{ height: 35 }}
                />
                <img
                  src="/static/images/logo.png"
                  alt="Selfbingo Logo"
                  style={{ height: 35 }}
                />
              </a>
            </Link>
            <Search
              placeholder={t('SEARCH_INPUT_PLACEHOLER')}
              onSearch={(value) => handleSearch(value)}
              style={{ width: 250, height: 30 }}
            />
            <CenteredRow>
              <Dropdown
                overlay={langMenu}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <GlobalOutlined
                  style={{ fontSize: '1.2rem', color: 'gray', marginRight: 16 }}
                />
              </Dropdown>
              <Dropdown
                overlay={hamburgerMenu}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <MenuOutlined style={{ fontSize: '1.3rem', color: 'gray' }} />
              </Dropdown>
            </CenteredRow>
          </CenterAlign>
        </Col>
        <Col xs={23} sm={0} md={0} lg={0} xl={0}>
          <CenterAlign>
            <Link href="/">
              <a>
                <img
                  src="/static/images/logo.png"
                  alt="Selfbingo Logo"
                  style={{ height: 22 }}
                />
              </a>
            </Link>
            <Search
              placeholder={t('SEARCH_INPUT_PLACEHOLER')}
              onSearch={(value) => handleSearch(value)}
              style={{ width: 150, height: 28 }}
            />
            <CenteredRow>
              <Dropdown
                overlay={langMenu}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <GlobalOutlined
                  style={{ fontSize: '1.2rem', color: 'gray', marginRight: 12 }}
                />
              </Dropdown>
              <Dropdown
                overlay={hamburgerMenu}
                placement="bottomRight"
                trigger={['click']}
                arrow
              >
                <MenuOutlined style={{ fontSize: '1.3rem', color: 'gray' }} />
              </Dropdown>
            </CenteredRow>
          </CenterAlign>
        </Col>
      </Row>
    </NavigationBar>
  );
}

const NavigationBar = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  /* display: flex; */
  /* justify-content: space-between; */
  /* align-items: center; */
  /* max-width: 100%; */
  border-bottom: 1px solid lightgray;
  background-color: rgba(255, 255, 255, 1);
  z-index: 101;
`;

const NavigationButton = styled.span`
  color: var(--mono-5);
`;

const CenterAlign = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HamburgerMenuTab = styled.div`
  color: rgba(0, 0, 0, 0.85);
  margin: 5px 0px;
`;
