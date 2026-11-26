package com.white.engine.core

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder

/**
 * KeepService — 引擎前台保活 (平移自 WebView 版的设计)
 * 切后台引擎不死; 被系统杀后 START_STICKY 拉起。
 */
class KeepService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForegroundCompat()
        return START_STICKY
    }

    private fun startForegroundCompat() {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val builder = if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(
                NotificationChannel("white_keep", "WHITE 引擎保活", NotificationManager.IMPORTANCE_MIN)
            )
            Notification.Builder(this, "white_keep")
        } else {
            @Suppress("DEPRECATION") Notification.Builder(this)
        }
        val n: Notification = builder
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("WHITE 引擎运行中")
            .setContentText("原生内核后台保活 · 切后台不中断")
            .setOngoing(true)
            .build()
        startForeground(1, n)
        FileLogger.w("KeepService", "前台保活通知已挂载")
    }
}
