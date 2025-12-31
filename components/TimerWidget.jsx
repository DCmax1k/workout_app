
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, { 
    FadeIn, 
    FadeInDown, 
    FadeOut, 
    FadeOutDown, 
    useAnimatedStyle, 
    withTiming, 
    Easing,
    useSharedValue
} from 'react-native-reanimated';
import PopupSheet from './PopupSheet';
import TouchableScale from './TouchableScale';
import { Colors } from '../constants/Colors';
import Spacer from './Spacer';
import ImageContain from './ImageContain';
import timerIcon from '../assets/icons/timer.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const formatTime = (totalSeconds) => {
        if (totalSeconds < 0) return '0:00';
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const displayM = m.toString().padStart(2, '0');
        const displayS = s.toString().padStart(2, '0');
        if (h > 0) return `${h}:${displayM}:${displayS}`;
        return `${m}:${displayS}`;
    };

const Controls = ({ isRunning, onToggle, onSkip, onReset, onSetTime, onOffsetTime, isCompleted, seconds, restTimer }) => {
    return (
        <View style={styles.controlsContainer}>
            <Text style={styles.controlsTitle}>
                {isCompleted ? "Timer Completed!" : "Timer Controls"}
            </Text>
            <Spacer height={10} />
            <Text style={{color: "white", fontSize: 18,}}>{formatTime(seconds)}</Text>
            <Spacer height={20} />
            <View style={styles.buttonRow}>
                {!isCompleted && (
                    <TouchableScale parentStyle={{flex: 1}} onPress={onToggle} style={[styles.controlButton, { backgroundColor: isRunning ? Colors.primaryOrange : "#21863C" }]}>
                        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
                    </TouchableScale>
                )}

                <TouchableScale parentStyle={{flex: 1}} onPress={onReset} style={[styles.controlButton, { backgroundColor: '#555' }]}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableScale>

                <TouchableScale parentStyle={{flex: 1}} onPress={onSkip} style={[styles.controlButton, { backgroundColor: Colors.protein }]}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableScale>
            </View>

            <View style={[styles.buttonRow, { marginTop: 15 }]}>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onOffsetTime(-15)} style={styles.presetButton}>
                    <Text style={styles.presetText}>-15s</Text>
                </TouchableScale>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onOffsetTime(15)} style={styles.presetButton}>
                    <Text style={styles.presetText}>+15s</Text>
                </TouchableScale>
                <TouchableScale parentStyle={{flex: 1}} onPress={() => onSetTime(60)} style={styles.presetButton}>
                    <Text style={styles.presetText}>1m</Text>
                </TouchableScale>
            </View>
            {restTimer && (
                <View style={[styles.buttonRow, { marginTop: 15 , marginBottom: -30}]}>
                    <Text style={[styles.buttonText, {fontWeight: "400", fontSize: 12}]}>Configure Rest Timer in User Preferences</Text>
                </View>
            )}
            
        </View>
    );
}

const TimerWidget = ({ 
    initialSeconds = -1,
    initialText = "", 
    autoStart = true, 
    textStyle, 
    style, 
    controlsPortalIndex = 0, 
    backgroundColor="transparent",
    activeScale=1.1,
    restTimer=false,
    onTimerEnd = () => {},
    onSkip = () => {},
    ...props 
}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [controlsActive, setControlsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isCountdown, setIsCountdown] = useState(initialSeconds > 0);

    const startTimeRef = useRef(Date.now());
    const baseSecondsRef = useRef(initialSeconds);

    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        baseSecondsRef.current = initialSeconds;
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        let interval = null;

        if (isRunning && !isCompleted) {
            startTimeRef.current = Date.now();

            interval = setInterval(() => {
                const now = Date.now();
                const delta = Math.floor((now - startTimeRef.current) / 1000);
                
                let nextVal;
                if (isCountdown) {
                    nextVal = baseSecondsRef.current - delta;
                } else {
                    // Corrected Logic: If starting from -1, the first second elapsed should result in 1.
                    // Otherwise, it just adds the delta to the current base.
                    if (baseSecondsRef.current === -1) {
                        nextVal = -1 + (delta + 1); // delta of 0s = -1, delta of 1s = 1, delta of 2s = 2...
                    } else {
                        nextVal = baseSecondsRef.current + delta;
                    }
                }
                
                if (isCountdown && nextVal <= 0) {
                    setSeconds(0);
                    setIsRunning(false);
                    setIsCompleted(true);
                    setControlsActive(true);
                    onTimerEnd();
                } else {
                    setSeconds(nextVal);
                }
            }, 100); 
        } else {
            baseSecondsRef.current = seconds;
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, isCountdown, isCompleted]);

    useEffect(() => {
        if (containerWidth > 0) {
            let targetWidth = containerWidth;
            if (isCountdown && totalSeconds > 0) {
                targetWidth = containerWidth * (Math.max(0, seconds) / totalSeconds);
            }

            if (seconds === totalSeconds || !isRunning) {
                animatedWidth.value = targetWidth; 
            } else {
                animatedWidth.value = withTiming(targetWidth, {
                    duration: 1000,
                    easing: Easing.linear,
                });
            }
        }
    }, [seconds, containerWidth, totalSeconds, isCountdown, isRunning]);

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: animatedWidth.value,
    }));

    const handleSetTime = (secs) => {
        baseSecondsRef.current = secs;
        startTimeRef.current = Date.now();
        setSeconds(secs);
        setTotalSeconds(secs);
        setIsCountdown(true);
        setIsCompleted(false);
        setIsRunning(true);
    };

    const handleOffsetTime = (num) => {
        const newSeconds = Math.max(0, seconds + num);
        baseSecondsRef.current = newSeconds;
        startTimeRef.current = Date.now();
        setSeconds(newSeconds);

        if (newSeconds > totalSeconds) {
            setTotalSeconds(newSeconds);
        }

        if (newSeconds > 0 && isCompleted) {
            setIsCompleted(false);
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        baseSecondsRef.current = initialSeconds;
        startTimeRef.current = Date.now();
        setSeconds(initialSeconds);
        setTotalSeconds(initialSeconds);
        setIsCountdown(initialSeconds > 0);
        setIsCompleted(false);
        setIsRunning(autoStart);
    };

    const handleSkip = () => {
        setIsRunning(false);
        const finalSecs = isCountdown ? 0 : seconds;
        baseSecondsRef.current = finalSecs;
        setSeconds(finalSecs);
        setControlsActive(false);
        setIsCompleted(false);
        onSkip();
    };

    return (
        <>
            <TouchableScale 
                activeScale={activeScale} 
                onPress={() => setControlsActive(true)} 
                style={[style, { overflow: 'hidden' }]}
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            >
                {seconds >= 0 ? (
                    <Animated.Text style={[{ fontSize: 20, color: isCompleted ? "#ff3b30" : "white", fontWeight: '600', zIndex: 1 }, textStyle]}>
                        {formatTime(seconds)}
                    </Animated.Text>
                ) : initialText.length > 0 ? (
                    <Animated.Text style={[{ fontSize: 20, color: "white", fontWeight: '600', zIndex: 1 }, textStyle]}>
                        {initialText}
                    </Animated.Text>
                ) : (
                    <ImageContain source={timerIcon} imgStyle={{tintColor: "white"}} style={{ height: 25, width: 25, zIndex: 1}} />
                )}
                

                <Animated.View style={[
                    {
                        backgroundColor, 
                        position: "absolute", 
                        left: 0, 
                        top: 0, 
                        height: "100%", 
                        zIndex: 0
                    },
                    animatedProgressStyle
                ]} />
            </TouchableScale>

            {controlsActive && (
            
                    controlsPortalIndex === 0 ? (
                        <Portal>
                            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
                                <Pressable onPress={() => setControlsActive(false)} style={StyleSheet.absoluteFill}/>
                                <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={styles.modalContent}>
                                    <Controls 
                                        isRunning={isRunning}
                                        isCompleted={isCompleted}
                                        onToggle={() => setIsRunning(!isRunning)}
                                        onSkip={handleSkip}
                                        onReset={handleReset}
                                        onSetTime={handleSetTime}
                                        onOffsetTime={handleOffsetTime}
                                        seconds={seconds}
                                        restTimer={restTimer}
                                    />
                                </Animated.View>
                            </Animated.View>
                        </Portal>
                    ) : (
                        <PopupSheet active={controlsActive} setActive={setControlsActive} >
                             <Controls 
                                isRunning={isRunning}
                                isCompleted={isCompleted}
                                onToggle={() => setIsRunning(!isRunning)}
                                onSkip={handleSkip}
                                onReset={handleReset}
                                onSetTime={handleSetTime}
                                onOffsetTime={handleOffsetTime}
                                seconds={seconds}
                                restTimer={restTimer}
                            />
                        </PopupSheet>
                    )
                
            )}
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.8)", 
        position: "absolute", 
        width: screenWidth, 
        height: screenHeight, 
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: screenWidth - 40,
        backgroundColor: '#222',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    controlsContainer: {
        alignItems: 'center',
    },
    controlsTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        height: 50,
    },
    controlButton: {
        flex: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: "center",
    },
    presetButton: {
        flex: 1,
        backgroundColor: '#3a3a3c',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 1,
        borderColor: '#505050ff'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    presetText: {
        color: '#0a84ff',
        fontWeight: '600',
        fontSize: 14
    }
});

export default TimerWidget;