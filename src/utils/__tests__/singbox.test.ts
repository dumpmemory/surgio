import test from 'ava'

import { NodeTypeEnum, PossibleNodeConfigType } from '../../types'
import * as singbox from '../singbox'

const nodeList: ReadonlyArray<PossibleNodeConfigType> = [
  {
    nodeName: 'disabled',
    type: NodeTypeEnum.Shadowsocks,
    enable: false,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
  },
  {
    nodeName: 'ss',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
  },
  {
    nodeName: 'ss.complex',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'http',
    obfsHost: 'example.com',
    obfsUri: '/obfs',
    skipCertVerify: true,
    wsHeaders: {
      foo: 'bar',
    },
    tls13: true,
    mux: true,
    multiplex: {
      protocol: 'smux',
      maxConnections: 2,
      minStreams: 1,
      maxStreams: 0,
      padding: true,
      brutal: {
        upMbps: 100,
        downMbps: 100,
      },
    },
    tfo: true,
    mptcp: true,
    shadowTls: {
      version: 3,
      password: 'password',
      sni: 'example.com',
    },
    underlyingProxy: 'vmess.ws',
  },
  {
    nodeName: 'ss.tls',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'tls',
    obfsHost: 'example.com',
  },
  {
    nodeName: 'ss.http',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'http',
    obfsHost: 'example.com',
  },
  {
    nodeName: 'ss.ws',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'ws',
    obfsHost: 'example.com',
    obfsUri: '/obfs',
    wsHeaders: {
      foo: 'bar',
    },
    mux: false,
  },
  {
    nodeName: 'ss.wss',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'wss',
    obfsHost: 'example.com',
    obfsUri: '/obfs',
    wsHeaders: {
      foo: 'bar',
    },
    mux: true,
  },
  {
    nodeName: 'ss.quic',
    type: NodeTypeEnum.Shadowsocks,
    hostname: 'example.com',
    port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    obfs: 'quic',
    obfsHost: 'example.com',
    obfsUri: '/obfs',
    wsHeaders: {
      foo: 'bar',
    },
    mux: true,
  },
  {
    nodeName: 'vmess.tcp',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 1,
    network: 'tcp',
  },
  {
    nodeName: 'vmess.h2NotSupported',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'h2',
    h2Opts: {
      path: '/foo',
      host: ['example.com'],
    },
  },
  {
    nodeName: 'vmess.complex',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'ws',
    wsOpts: {
      path: '/foo',
      headers: {
        Host: 'example.com',
      },
    },
    tls: true,
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
    multiplex: {
      protocol: 'smux',
      maxConnections: 2,
      minStreams: 1,
      maxStreams: 0,
      padding: true,
      brutal: {
        upMbps: 100,
        downMbps: 100,
      },
    },
    tfo: true,
    mptcp: true,
    shadowTls: {
      version: 3,
      password: 'password',
      sni: 'example.com',
    },
    underlyingProxy: 'ss',
  },
  {
    nodeName: 'vmess.http',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'http',
    httpOpts: {
      path: ['/foo'],
      headers: {
        Host: 'example.com',
      },
      method: 'POST',
    },
  },
  {
    nodeName: 'vmess.ws',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'ws',
    wsOpts: {
      path: '/foo',
      headers: {
        Host: 'example.com',
      },
    },
  },
  {
    nodeName: 'vmess.quic',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'quic',
  },
  {
    nodeName: 'vmess.grpc',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'grpc',
    grpcOpts: {
      serviceName: 'example',
    },
  },
  {
    nodeName: 'vmess.httpupgrade',
    type: NodeTypeEnum.Vmess,
    hostname: 'example.com',
    port: 443,
    method: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alterId: 0,
    network: 'httpupgrade',
    httpUpgradeOpts: {
      path: '/foo',
      host: 'example.com',
      headers: {
        Host: 'example.com',
      },
    },
  },
  {
    nodeName: 'vless.tcp',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'tcp',
  },
  {
    nodeName: 'vless.h2NotSupported',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'h2',
    h2Opts: {
      path: '/foo',
      host: ['example.com'],
    },
  },
  {
    nodeName: 'vless.complex',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'ws',
    wsOpts: {
      path: '/foo',
      headers: {
        Host: 'example.com',
      },
    },
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    multiplex: {
      protocol: 'smux',
      maxConnections: 2,
      minStreams: 1,
      maxStreams: 0,
      padding: true,
      brutal: {
        upMbps: 100,
        downMbps: 100,
      },
    },
    tfo: true,
    mptcp: true,
    shadowTls: {
      version: 3,
      password: 'password',
      sni: 'example.com',
    },
    underlyingProxy: 'ss',
  },
  {
    nodeName: 'vless.http',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'http',
    httpOpts: {
      path: ['/foo'],
      headers: {
        Host: 'example.com',
      },
      method: 'POST',
    },
  },
  {
    nodeName: 'vless.ws',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'ws',
    wsOpts: {
      path: '/foo',
      headers: {
        Host: 'example.com',
      },
    },
  },
  {
    nodeName: 'vless.quic',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'quic',
  },
  {
    nodeName: 'vless.grpc',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'grpc',
    grpcOpts: {
      serviceName: 'example',
    },
  },
  {
    nodeName: 'vless.httpupgrade',
    type: NodeTypeEnum.Vless,
    hostname: 'example.com',
    port: 443,
    method: 'none',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    realityOpts: {
      publicKey: 'publicKey',
      shortId: 'shortId',
    },
    clientFingerprint: 'chrome2',
    network: 'httpupgrade',
    httpUpgradeOpts: {
      path: '/foo',
      host: 'example.com',
      headers: {
        Host: 'example.com',
      },
    },
  },
  {
    nodeName: 'http',
    type: NodeTypeEnum.HTTP,
    hostname: 'example.com',
    port: 80,
    username: 'username',
    password: 'password',
    path: '/foo',
    headers: {
      Host: 'example.com',
    },
  },
  {
    nodeName: 'https',
    type: NodeTypeEnum.HTTPS,
    hostname: 'example.com',
    port: 443,
    username: 'username',
    password: 'password',
    path: '/foo',
    headers: {
      Host: 'example.com',
    },
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
  },
  {
    nodeName: 'trojan.tcpNotSupported',
    type: NodeTypeEnum.Trojan,
    hostname: 'example.com',
    port: 443,
    password: 'password',
    network: 'tcp',
  },
  {
    nodeName: 'trojan.ws',
    type: NodeTypeEnum.Trojan,
    hostname: 'example.com',
    port: 443,
    password: 'password',
    network: 'ws',
    wsPath: '/foo',
    wsHeaders: {
      Host: 'example.com',
    },
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
    multiplex: {
      protocol: 'smux',
      maxConnections: 2,
      minStreams: 1,
      maxStreams: 0,
      padding: true,
      brutal: {
        upMbps: 100,
        downMbps: 100,
      },
    },
  },
  {
    nodeName: 'socks',
    type: NodeTypeEnum.Socks5,
    hostname: 'example.com',
    port: 8080,
    username: 'username',
    password: 'password',
    udpRelay: true,
    tls: true,
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
  },
  {
    nodeName: 'tuic.versionNotSupported',
    type: NodeTypeEnum.Tuic,
    hostname: 'example.com',
    port: 443,
    token: 'token',
  },
  {
    nodeName: 'tuic',
    type: NodeTypeEnum.Tuic,
    hostname: 'example.com',
    port: 443,
    password: 'password',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    version: 5,
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
  },
  {
    nodeName: 'hysteria2',
    type: NodeTypeEnum.Hysteria2,
    hostname: 'example.com',
    port: 443,
    password: 'password',
    downloadBandwidth: 100,
    uploadBandwidth: 100,
    obfs: 'salamander',
    obfsPassword: 'password',
    sni: 'example.com',
    tls13: true,
    skipCertVerify: true,
    alpn: ['h2', 'http/1.1'],
    clientFingerprint: 'chrome2',
  },
  {
    nodeName: 'wg',
    type: NodeTypeEnum.Wireguard,
    selfIp: '10.0.0.1',
    selfIpV6: '2001:db8:85a3::8a2e:370:7334',
    privateKey: 'privateKey',
    mtu: 1420,
    peers: [
      {
        publicKey: 'publicKey1',
        endpoint: 'wg1.example.com:51820',
        allowedIps: '0.0.0.0/0, ::/0',
        presharedKey: 'presharedKey1',
        reservedBits: [1, 2, 3],
      },
      {
        publicKey: 'publicKey2',
        endpoint: 'wg2.example.com:51820',
        allowedIps: '0.0.0.0/0, ::/0',
        presharedKey: 'presharedKey2',
        reservedBits: [2, 2, 3],
      },
      {
        publicKey: 'publicKey3',
        endpoint: '162.159.195.115:7156',
        allowedIps: '0.0.0.0/0, ::/0',
        presharedKey: 'presharedKey3',
        reservedBits: [3, 2, 3],
      },
      {
        publicKey: 'publicKey4',
        endpoint: '[2606:4700:d0:0:8537:1837:8101:92fd]:942',
        allowedIps: '0.0.0.0/0, ::/0',
        presharedKey: 'presharedKey4',
        reservedBits: [4, 2, 3],
      },
    ],
  },
]

const expectedNodes: Record<string, any>[] = [
  {
    type: 'shadowsocks',
    tag: 'ss',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
  },
  {
    type: 'shadowsocks',
    tag: 'ss.complex',
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'obfs-local',
    plugin_opts: 'obfs=http;obfs-host=example.com',
    tls: { enabled: true, insecure: true, min_version: '1.3' },
    multiplex: {
      protocol: 'smux',
      max_connections: 2,
      min_streams: 1,
      max_streams: 0,
      padding: true,
      enabled: true,
      brutal: { up_mbps: 100, down_mbps: 100 },
    },
    tcp_fast_open: true,
    tcp_multi_path: true,
    detour: 'ss.complex-shadowtls',
  },
  {
    type: 'shadowtls',
    tag: 'ss.complex-shadowtls',
    server: 'example.com',
    server_port: 443,
    version: 3,
    password: 'password',
    tls: { enabled: true, server_name: 'example.com' },
  },
  {
    type: 'shadowsocks',
    tag: 'ss.tls',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'obfs-local',
    plugin_opts: 'obfs=tls;obfs-host=example.com',
  },
  {
    type: 'shadowsocks',
    tag: 'ss.http',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'obfs-local',
    plugin_opts: 'obfs=http;obfs-host=example.com',
  },
  {
    type: 'shadowsocks',
    tag: 'ss.ws',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'v2ray-plugin',
    plugin_opts: 'host=example.com;mode=websocket;mux=0;path=/obfs;tls=false',
  },
  {
    type: 'shadowsocks',
    tag: 'ss.wss',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'v2ray-plugin',
    plugin_opts: 'host=example.com;mode=websocket;path=/obfs;tls=true',
  },
  {
    type: 'shadowsocks',
    tag: 'ss.quic',
    server: 'example.com',
    server_port: 443,
    method: 'chacha20-ietf-poly1305',
    password: 'password',
    plugin: 'v2ray-plugin',
    plugin_opts: 'host=example.com;mode=quic;path=/obfs;tls=true',
  },
  {
    type: 'vmess',
    tag: 'vmess.tcp',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    alter_id: 1,
  },
  {
    type: 'vmess',
    tag: 'vmess.complex',
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: { type: 'ws', path: '/foo', headers: { Host: ['example.com'] } },
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
    multiplex: {
      protocol: 'smux',
      max_connections: 2,
      min_streams: 1,
      max_streams: 0,
      padding: true,
      enabled: true,
      brutal: { up_mbps: 100, down_mbps: 100 },
    },
    tcp_fast_open: true,
    tcp_multi_path: true,
    detour: 'vmess.complex-shadowtls',
  },
  {
    type: 'shadowtls',
    tag: 'vmess.complex-shadowtls',
    server: 'example.com',
    server_port: 443,
    version: 3,
    password: 'password',
    tls: { enabled: true, server_name: 'example.com' },
  },
  {
    type: 'vmess',
    tag: 'vmess.http',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: {
      type: 'http',
      path: '/foo',
      method: 'POST',
      headers: { Host: ['example.com'] },
    },
  },
  {
    type: 'vmess',
    tag: 'vmess.ws',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: { type: 'ws', path: '/foo', headers: { Host: ['example.com'] } },
  },
  {
    type: 'vmess',
    tag: 'vmess.quic',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: { type: 'quic' },
  },
  {
    type: 'vmess',
    tag: 'vmess.grpc',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: { type: 'grpc', service_name: 'example' },
  },
  {
    type: 'vmess',
    tag: 'vmess.httpupgrade',
    server: 'example.com',
    server_port: 443,
    security: 'auto',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    transport: {
      type: 'httpupgrade',
      host: 'example.com',
      path: '/foo',
      headers: { Host: ['example.com'] },
    },
  },
  {
    type: 'vless',
    tag: 'vless.tcp',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
  },
  {
    type: 'vless',
    tag: 'vless.complex',
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
    },
    transport: { type: 'ws', path: '/foo', headers: { Host: ['example.com'] } },
    multiplex: {
      protocol: 'smux',
      max_connections: 2,
      min_streams: 1,
      max_streams: 0,
      padding: true,
      enabled: true,
      brutal: { up_mbps: 100, down_mbps: 100 },
    },
    tcp_fast_open: true,
    tcp_multi_path: true,
    detour: 'vless.complex-shadowtls',
  },
  {
    type: 'shadowtls',
    tag: 'vless.complex-shadowtls',
    server: 'example.com',
    server_port: 443,
    version: 3,
    password: 'password',
    tls: { enabled: true, server_name: 'example.com' },
  },
  {
    type: 'vless',
    tag: 'vless.http',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
    transport: {
      type: 'http',
      path: '/foo',
      method: 'POST',
      headers: { Host: ['example.com'] },
    },
  },
  {
    type: 'vless',
    tag: 'vless.ws',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
    transport: { type: 'ws', path: '/foo', headers: { Host: ['example.com'] } },
  },
  {
    type: 'vless',
    tag: 'vless.quic',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
    transport: { type: 'quic' },
  },
  {
    type: 'vless',
    tag: 'vless.grpc',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
    transport: { type: 'grpc', service_name: 'example' },
  },
  {
    type: 'vless',
    tag: 'vless.httpupgrade',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    flow: 'xtls-rprx-vision',
    tls: {
      enabled: true,
      utls: { enabled: true, fingerprint: 'chrome2' },
      reality: { enabled: true, public_key: 'publicKey', short_id: 'shortId' },
    },
    transport: {
      type: 'httpupgrade',
      host: 'example.com',
      path: '/foo',
      headers: { Host: ['example.com'] },
    },
  },
  {
    type: 'http',
    tag: 'http',
    server: 'example.com',
    server_port: 80,
    username: 'username',
    password: 'password',
    path: '/foo',
    headers: { Host: ['example.com'] },
  },
  {
    type: 'http',
    tag: 'https',
    server: 'example.com',
    server_port: 443,
    username: 'username',
    password: 'password',
    path: '/foo',
    headers: { Host: ['example.com'] },
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
  },
  {
    type: 'trojan',
    tag: 'trojan.ws',
    server: 'example.com',
    server_port: 443,
    password: 'password',
    transport: { type: 'ws', path: '/foo', headers: { Host: ['example.com'] } },
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
    multiplex: {
      protocol: 'smux',
      max_connections: 2,
      min_streams: 1,
      max_streams: 0,
      padding: true,
      enabled: true,
      brutal: { up_mbps: 100, down_mbps: 100 },
    },
  },
  {
    type: 'socks',
    tag: 'socks',
    server: 'example.com',
    server_port: 8080,
    username: 'username',
    password: 'password',
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
  },
  {
    type: 'tuic',
    tag: 'tuic',
    server: 'example.com',
    server_port: 443,
    uuid: '1386f85e-657b-4d6e-9d56-78badb75e1fd',
    password: 'password',
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
  },
  {
    type: 'hysteria2',
    tag: 'hysteria2',
    server: 'example.com',
    server_port: 443,
    up_mbps: 100,
    down_mbps: 100,
    obfs: { type: 'salamander', password: 'password' },
    password: 'password',
    tls: {
      enabled: true,
      server_name: 'example.com',
      insecure: true,
      alpn: ['h2', 'http/1.1'],
      min_version: '1.3',
      utls: { enabled: true, fingerprint: 'chrome2' },
    },
  },
  {
    type: 'wireguard',
    tag: 'wg',
    local_address: ['10.0.0.1/32', '2001:db8:85a3::8a2e:370:7334/128'],
    private_key: 'privateKey',
    peers: [
      {
        server: 'wg1.example.com',
        server_port: 51820,
        public_key: 'publicKey1',
        pre_shared_key: 'presharedKey1',
        allowed_ips: ['0.0.0.0/0', '::/0'],
        reserved: [1, 2, 3],
      },
      {
        server: 'wg2.example.com',
        server_port: 51820,
        public_key: 'publicKey2',
        pre_shared_key: 'presharedKey2',
        allowed_ips: ['0.0.0.0/0', '::/0'],
        reserved: [2, 2, 3],
      },
      {
        server: '162.159.195.115',
        server_port: 7156,
        public_key: 'publicKey3',
        pre_shared_key: 'presharedKey3',
        allowed_ips: ['0.0.0.0/0', '::/0'],
        reserved: [3, 2, 3],
      },
      {
        server: '[2606:4700:d0:0:8537:1837:8101:92fd]',
        server_port: 942,
        public_key: 'publicKey4',
        pre_shared_key: 'presharedKey4',
        allowed_ips: ['0.0.0.0/0', '::/0'],
        reserved: [4, 2, 3],
      },
    ],
    mtu: 1420,
  },
]

const expectedNodeNames = expectedNodes
  .map((node) => node.tag as string)
  .filter((name) => !['NotSupported', 'disabled'].some((n) => name.includes(n)))

test('getSingboxNodeNames', async (t) => {
  t.deepEqual(singbox.getSingboxNodeNames(nodeList), expectedNodeNames)

  t.deepEqual(
    singbox.getSingboxNodeNames(
      nodeList,
      (nodeConfig) => nodeConfig.nodeName === 'ss',
    ),
    ['ss'],
  )
})

test('getSingboxNodes', async (t) => {
  t.deepEqual(singbox.getSingboxNodes(nodeList), expectedNodes)

  t.deepEqual(
    singbox.getSingboxNodes(
      nodeList,
      (nodeConfig) => nodeConfig.nodeName === 'ss',
    ),
    [expectedNodes[0]],
  )
})
